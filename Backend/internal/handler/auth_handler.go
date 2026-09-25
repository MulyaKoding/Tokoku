package handler

import (
	"errors"
	"net/http"

	apperrors "github.com/ecommerce-system/golang-api/internal/errors"
	"github.com/ecommerce-system/golang-api/internal/middleware"
	"github.com/ecommerce-system/golang-api/internal/models"
	"github.com/ecommerce-system/golang-api/internal/repository"
	"github.com/ecommerce-system/golang-api/internal/response"
	"github.com/ecommerce-system/golang-api/internal/service"
	"github.com/ecommerce-system/golang-api/internal/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	userRepo         repository.UserRepository
	verificationRepo repository.VerificationRepository
	emailService     service.EmailService
	jwtSecret        string
}

func NewAuthHandler(
	userRepo repository.UserRepository,
	verificationRepo repository.VerificationRepository,
	emailService service.EmailService,
	jwtSecret string,
) *AuthHandler {
	return &AuthHandler{
		userRepo:         userRepo,
		verificationRepo: verificationRepo,
		emailService:     emailService,
		jwtSecret:        jwtSecret,
	}
}

func (h *AuthHandler) RegisterRoutes(rg *gin.RouterGroup) {
	auth := rg.Group("/auth")
	{
		// Flow verifikasi email dengan OTP
		auth.POST("/request-register", h.RequestRegister)
		auth.POST("/verify-register", h.VerifyRegister)
		auth.POST("/resend-code", h.ResendCode)

		// Direct register & login
		auth.POST("/register", h.Register)
		auth.POST("/login", h.Login)
		auth.GET("/me", middleware.AuthMiddleware(h.jwtSecret), h.Me)
	}
}

// RequestRegister memvalidasi data form, meng-generate kode OTP, dan mengirimkannya ke email pendaftar
func (h *AuthHandler) RequestRegister(c *gin.Context) {
	var req models.RequestRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Data registrasi tidak valid: "+err.Error(), err)
		return
	}

	// Cek apakah email sudah terdaftar sebelumnya
	existing, err := h.userRepo.FindByEmail(c.Request.Context(), req.Email)
	if err == nil && existing != nil {
		response.Error(c, http.StatusConflict, "Email sudah terdaftar. Silakan masuk atau gunakan email lain.", nil)
		return
	}

	// Hash password pendaftar
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal memproses kata sandi", err)
		return
	}

	// Buat kode OTP 6-digit
	otpCode := h.emailService.GenerateOTP()

	verification := models.VerificationCode{
		Email:    req.Email,
		Code:     otpCode,
		Name:     req.Name,
		Password: string(hashedPassword),
	}

	// Simpan ke collection verification_codes
	if err := h.verificationRepo.SaveCode(c.Request.Context(), &verification); err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal menyimpan kode verifikasi", err)
		return
	}

	// Kirim email notifikasi kode OTP
	_ = h.emailService.SendVerificationEmail(req.Email, req.Name, otpCode)

	response.Success(c, http.StatusOK, "Kode verifikasi 6-digit telah dikirim ke email Anda. Silakan periksa kotak masuk atau spam.", gin.H{
		"email": req.Email,
	})
}

// VerifyRegister memvalidasi kode OTP yang diinput pengguna dan mengaktifkan akun user
func (h *AuthHandler) VerifyRegister(c *gin.Context) {
	var req models.VerifyRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Email dan kode verifikasi 6-digit diperlukan", err)
		return
	}

	// Cari dan validasi kode OTP di database
	verification, err := h.verificationRepo.FindByEmailAndCode(c.Request.Context(), req.Email, req.Code)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Kode verifikasi salah atau sudah kadaluarsa (berlaku 10 menit)", err)
		return
	}

	avatarUrl := "https://api.dicebear.com/7.x/avataaars/svg?seed=" + verification.Name

	user := models.User{
		Name:       verification.Name,
		Email:      verification.Email,
		Password:   verification.Password,
		Role:       "user",
		Avatar:     avatarUrl,
		IsVerified: true,
	}

	// Simpan user aktif ke collection users
	if err := h.userRepo.Create(c.Request.Context(), &user); err != nil {
		if errors.Is(err, repository.ErrUserAlreadyExists) {
			response.Error(c, http.StatusConflict, "Email sudah terdaftar", err)
			return
		}
		response.Error(c, http.StatusInternalServerError, "Gagal membuat akun pengguna", err)
		return
	}

	// Hapus kode OTP yang sudah sukses terpakai
	_ = h.verificationRepo.DeleteByEmail(c.Request.Context(), req.Email)

	// Generate JWT token untuk login otomatis
	token, err := utils.GenerateToken(&user, h.jwtSecret)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal membuat sesi autentikasi", err)
		return
	}

	response.Success(c, http.StatusCreated, "Verifikasi email berhasil! Akun Anda telah aktif.", models.AuthResponse{
		Token: token,
		User:  user,
	})
}

// ResendCode mengirim ulang kode OTP baru ke email pendaftar
func (h *AuthHandler) ResendCode(c *gin.Context) {
	var req models.ResendCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Email diperlukan", err)
		return
	}

	// Cari entri registrasi yang sedang menunggu verifikasi
	pending, err := h.verificationRepo.FindByEmail(c.Request.Context(), req.Email)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Tidak ada pendaftaran pending untuk email ini. Silakan daftar ulang.", err)
		return
	}

	// Generate kode baru
	newOTP := h.emailService.GenerateOTP()
	pending.Code = newOTP

	if err := h.verificationRepo.SaveCode(c.Request.Context(), pending); err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal memperbarui kode verifikasi", err)
		return
	}

	_ = h.emailService.SendVerificationEmail(pending.Email, pending.Name, newOTP)

	response.Success(c, http.StatusOK, "Kode verifikasi baru telah dikirimkan ke email Anda.", gin.H{
		"email": pending.Email,
	})
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Data registrasi tidak valid: "+err.Error(), err)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal mengenkripsi password", err)
		return
	}

	avatarUrl := "https://api.dicebear.com/7.x/avataaars/svg?seed=" + req.Name

	user := models.User{
		Name:       req.Name,
		Email:      req.Email,
		Password:   string(hashedPassword),
		Role:       "user",
		Avatar:     avatarUrl,
		IsVerified: true,
	}

	if err := h.userRepo.Create(c.Request.Context(), &user); err != nil {
		if errors.Is(err, repository.ErrUserAlreadyExists) {
			response.Error(c, http.StatusConflict, "Email sudah terdaftar. Silakan gunakan email lain atau masuk.", err)
			return
		}
		response.Error(c, http.StatusInternalServerError, "Gagal mendaftarkan pengguna", err)
		return
	}

	token, err := utils.GenerateToken(&user, h.jwtSecret)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal membuat token autentikasi", err)
		return
	}

	response.Success(c, http.StatusCreated, "Registrasi berhasil", models.AuthResponse{
		Token: token,
		User:  user,
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Format email atau password tidak valid", err)
		return
	}

	user, err := h.userRepo.FindByEmail(c.Request.Context(), req.Email)
	if err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			response.Error(c, http.StatusUnauthorized, "Email atau password salah", err)
			return
		}
		response.Error(c, http.StatusInternalServerError, "Gagal memproses autentikasi", err)
		return
	}

	// Cek password hash
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		response.Error(c, http.StatusUnauthorized, "Email atau password salah", err)
		return
	}

	// Buat token JWT
	token, err := utils.GenerateToken(user, h.jwtSecret)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal membuat token autentikasi", err)
		return
	}

	response.Success(c, http.StatusOK, "Login berhasil", models.AuthResponse{
		Token: token,
		User:  *user,
	})
}

func (h *AuthHandler) Me(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Sesi tidak ditemukan", nil)
		return
	}

	user, err := h.userRepo.FindByID(c.Request.Context(), userID.(string))
	if err != nil {
		if errors.Is(err, apperrors.ErrInvalidID) || errors.Is(err, repository.ErrUserNotFound) {
			response.Error(c, http.StatusNotFound, "Pengguna tidak ditemukan", err)
			return
		}
		response.Error(c, http.StatusInternalServerError, "Gagal mengambil data profil", err)
		return
	}

	response.Success(c, http.StatusOK, "Berhasil mengambil profil pengguna", user)
}
