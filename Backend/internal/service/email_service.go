package service

import (
	"crypto/rand"
	"crypto/tls"
	"fmt"
	"log"
	"math/big"
	"net"
	"net/smtp"
	"os"
	"strings"
)

type EmailService interface {
	GenerateOTP() string
	SendVerificationEmail(toEmail, toName, otpCode string) error
}

type emailService struct {
	smtpHost string
	smtpPort string
	smtpUser string
	smtpPass string
	fromName string
}

func NewEmailService() EmailService {
	port := os.Getenv("SMTP_PORT")
	if port == "" {
		port = "587"
	}
	fromName := os.Getenv("SMTP_FROM_NAME")
	if fromName == "" {
		fromName = "TokoKu Official"
	}

	return &emailService{
		smtpHost: os.Getenv("SMTP_HOST"),
		smtpPort: port,
		smtpUser: os.Getenv("SMTP_USER"),
		smtpPass: os.Getenv("SMTP_PASS"),
		fromName: fromName,
	}
}

// GenerateOTP menghasilkan 6-digit angka acak kriptografis
func (s *emailService) GenerateOTP() string {
	n, err := rand.Int(rand.Reader, big.NewInt(900000))
	if err != nil {
		return "123456"
	}
	return fmt.Sprintf("%06d", n.Int64()+100000)
}

func (s *emailService) SendVerificationEmail(toEmail, toName, otpCode string) error {
	subject := fmt.Sprintf("%s - Kode Verifikasi Pendaftaran TokoKu", otpCode)
	
	htmlBody := fmt.Sprintf(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B; }
    .card { max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header { background: #0E639C; color: #FFFFFF; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    .content { padding: 32px 28px; }
    .greeting { font-size: 16px; margin-bottom: 16px; font-weight: 600; }
    .desc { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
    .otp-box { background: #F0F9FF; border: 2px dashed #0E639C; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-label { font-size: 12px; font-weight: 600; color: #0E639C; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    .otp-code { font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0E639C; margin: 0; font-family: Consolas, monospace; }
    .expiry { font-size: 13px; color: #64748B; margin-top: 8px; }
    .warning { background: #FFFBEB; border-left: 4px solid #F59E0B; padding: 12px 16px; font-size: 13px; color: #92400E; border-radius: 4px; margin-top: 24px; }
    .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #94A3B8; background: #F8FAFC; border-top: 1px solid #E2E8F0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>TokoKu</h1>
    </div>
    <div class="content">
      <div class="greeting">Halo, %s! 👋</div>
      <div class="desc">
        Terima kasih telah mendaftar di <strong>TokoKu</strong>. Untuk menyelesaikan pendaftaran dan mengaktifkan akun Anda, silakan masukkan kode verifikasi berikut pada formulir pendaftaran:
      </div>
      
      <div class="otp-box">
        <div class="otp-label">Kode Verifikasi OTP Anda</div>
        <div class="otp-code">%s</div>
        <div class="expiry">⏱️ Berlaku selama <strong>10 menit</strong></div>
      </div>
      
      <div class="warning">
        🔒 <strong>Penting:</strong> Jangan berikan kode ini kepada siapapun termasuk pihak TokoKu demi keamanan akun Anda.
      </div>
    </div>
    <div class="footer">
      Email ini dikirim secara otomatis oleh sistem TokoKu. Jika Anda tidak merasa mendaftar, abaikan email ini.
    </div>
  </div>
</body>
</html>`, toName, otpCode)

	log.Println("=================================================================")
	log.Printf("📧 [EMAIL OUTBOX] Mengirim Email Verifikasi ke: %s (%s)\n", toEmail, toName)
	log.Printf("🔑 KODE OTP: %s\n", otpCode)
	log.Println("=================================================================")

	if s.smtpHost == "" || s.smtpUser == "" || s.smtpPass == "" {
		log.Printf("⚠️ Kredensial SMTP di .env (SMTP_USER/SMTP_PASS) belum dikonfigurasi. [DEV MODE] Kode OTP untuk %s dicetak di log terminal: %s\n", toEmail, otpCode)
		return nil
	}

	fromHeader := fmt.Sprintf("%s <%s>", s.fromName, s.smtpUser)
	headers := make(map[string]string)
	headers["From"] = fromHeader
	headers["To"] = toEmail
	headers["Subject"] = subject
	headers["MIME-Version"] = "1.0"
	headers["Content-Type"] = "text/html; charset=\"UTF-8\""

	message := ""
	for k, v := range headers {
		message += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	message += "\r\n" + htmlBody

	addr := fmt.Sprintf("%s:%s", s.smtpHost, s.smtpPort)

	// Kirim via TLS jika port 465
	if s.smtpPort == "465" {
		tlsconfig := &tls.Config{
			InsecureSkipVerify: false,
			ServerName:         s.smtpHost,
		}

		conn, err := tls.Dial("tcp", addr, tlsconfig)
		if err != nil {
			log.Printf("❌ Gagal koneksi TLS ke SMTP %s: %v\n", addr, err)
			if os.Getenv("APP_ENV") == "development" {
				log.Printf("⚠️ [DEV MODE] Mengabaikan error SMTP. Kode OTP untuk %s: %s\n", toEmail, otpCode)
				return nil
			}
			return err
		}
		defer conn.Close()

		client, err := smtp.NewClient(conn, s.smtpHost)
		if err != nil {
			log.Printf("❌ Gagal membuat SMTP client: %v\n", err)
			if os.Getenv("APP_ENV") == "development" {
				log.Printf("⚠️ [DEV MODE] Mengabaikan error SMTP. Kode OTP untuk %s: %s\n", toEmail, otpCode)
				return nil
			}
			return err
		}
		defer client.Quit()

		auth := smtp.PlainAuth("", s.smtpUser, s.smtpPass, s.smtpHost)
		if err = client.Auth(auth); err != nil {
			log.Printf("❌ Gagal autentikasi SMTP: %v\n", err)
			if os.Getenv("APP_ENV") == "development" {
				log.Printf("⚠️ [DEV MODE] Mengabaikan error SMTP. Kode OTP untuk %s: %s\n", toEmail, otpCode)
				return nil
			}
			return err
		}

		if err = client.Mail(s.smtpUser); err != nil {
			return err
		}
		if err = client.Rcpt(toEmail); err != nil {
			return err
		}

		w, err := client.Data()
		if err != nil {
			return err
		}
		_, err = w.Write([]byte(message))
		if err != nil {
			return err
		}
		err = w.Close()
		if err != nil {
			return err
		}
		log.Printf("✅ Email verifikasi OTP berhasil terkirim ke %s via SMTP TLS (Port 465)!\n", toEmail)
		return nil
	}

	// Kirim via STARTTLS (Port 587 / default)
	auth := smtp.PlainAuth("", s.smtpUser, s.smtpPass, s.smtpHost)
	
	// Gunakan host tanpa port untuk TLS ServerName
	hostName := strings.Split(s.smtpHost, ":")[0]

	// Cek koneksi & kirim
	err := sendMailWithSTARTTLS(addr, auth, s.smtpUser, []string{toEmail}, []byte(message), hostName)
	if err != nil {
		log.Printf("❌ Gagal mengirim email SMTP ke %s: %v\n", toEmail, err)
		if os.Getenv("APP_ENV") == "development" {
			log.Printf("⚠️ [DEV MODE] Mengabaikan error SMTP. Kode OTP untuk %s: %s\n", toEmail, otpCode)
			return nil
		}
		return err
	}

	log.Printf("✅ Email verifikasi OTP berhasil terkirim ke %s via SMTP (Port %s)!\n", toEmail, s.smtpPort)
	return nil
}

func sendMailWithSTARTTLS(addr string, auth smtp.Auth, from string, to []string, msg []byte, hostName string) error {
	conn, err := net.Dial("tcp", addr)
	if err != nil {
		return err
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, hostName)
	if err != nil {
		return err
	}
	defer client.Quit()

	if ok, _ := client.Extension("STARTTLS"); ok {
		config := &tls.Config{ServerName: hostName}
		if err = client.StartTLS(config); err != nil {
			return err
		}
	}

	if auth != nil {
		if ok, _ := client.Extension("AUTH"); ok {
			if err = client.Auth(auth); err != nil {
				return err
			}
		}
	}

	if err = client.Mail(from); err != nil {
		return err
	}
	for _, addr := range to {
		if err = client.Rcpt(addr); err != nil {
			return err
		}
	}

	w, err := client.Data()
	if err != nil {
		return err
	}
	_, err = w.Write(msg)
	if err != nil {
		return err
	}
	return w.Close()
}
