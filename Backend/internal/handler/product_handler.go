package handler

import (
	"errors"
	"net/http"

	apperrors "github.com/ecommerce-system/golang-api/internal/errors"
	"github.com/ecommerce-system/golang-api/internal/models"
	"github.com/ecommerce-system/golang-api/internal/repository"
	"github.com/ecommerce-system/golang-api/internal/response"
	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	repo repository.ProductRepository
}

func NewProductHandler(repo repository.ProductRepository) *ProductHandler {
	return &ProductHandler{repo: repo}
}

func (h *ProductHandler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/products", h.GetAll)
	rg.GET("/products/:id", h.GetByID)
	rg.POST("/products", h.Create)
	rg.PUT("/products/:id", h.Update)
	rg.DELETE("/products/:id", h.Delete)
}

func (h *ProductHandler) GetAll(c *gin.Context) {
	products, err := h.repo.FindAll(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal mengambil data produk", err)
		return
	}
	response.Success(c, http.StatusOK, "Berhasil mengambil data produk", products)
}

func (h *ProductHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	product, err := h.repo.FindByID(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, apperrors.ErrInvalidID) {
			response.Error(c, http.StatusBadRequest, apperrors.ErrInvalidID.Error(), err)
			return
		}
		if errors.Is(err, apperrors.ErrProductNotFound) {
			response.Error(c, http.StatusNotFound, apperrors.ErrProductNotFound.Error(), err)
			return
		}
		response.Error(c, http.StatusInternalServerError, "Gagal mengambil data produk", err)
		return
	}
	response.Success(c, http.StatusOK, "Berhasil mengambil data produk", product)
}

func (h *ProductHandler) Create(c *gin.Context) {
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		response.Error(c, http.StatusBadRequest, apperrors.ErrInvalidPayload.Error(), err)
		return
	}

	if err := h.repo.Create(c.Request.Context(), &product); err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal menyimpan produk", err)
		return
	}
	response.Success(c, http.StatusCreated, "Produk berhasil dibuat", product)
}

func (h *ProductHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		response.Error(c, http.StatusBadRequest, apperrors.ErrInvalidPayload.Error(), err)
		return
	}

	if err := h.repo.Update(c.Request.Context(), id, &product); err != nil {
		if errors.Is(err, apperrors.ErrInvalidID) {
			response.Error(c, http.StatusBadRequest, apperrors.ErrInvalidID.Error(), err)
			return
		}
		if errors.Is(err, apperrors.ErrProductNotFound) {
			response.Error(c, http.StatusNotFound, apperrors.ErrProductNotFound.Error(), err)
			return
		}
		response.Error(c, http.StatusInternalServerError, "Gagal mengupdate produk", err)
		return
	}
	response.Success(c, http.StatusOK, "Produk berhasil diupdate", nil)
}

func (h *ProductHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.repo.Delete(c.Request.Context(), id); err != nil {
		if errors.Is(err, apperrors.ErrInvalidID) {
			response.Error(c, http.StatusBadRequest, apperrors.ErrInvalidID.Error(), err)
			return
		}
		if errors.Is(err, apperrors.ErrProductNotFound) {
			response.Error(c, http.StatusNotFound, apperrors.ErrProductNotFound.Error(), err)
			return
		}
		response.Error(c, http.StatusInternalServerError, "Gagal menghapus produk", err)
		return
	}
	response.Success(c, http.StatusOK, "Produk berhasil dihapus", nil)
}