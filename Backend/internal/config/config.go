package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	AppName     string
	AppEnv      string
	AppPort     string
	AppVersion  string
	MongoURI    string
	MongoDBName string
	JWTSecret   string
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSL      bool
}

// Load membaca file .env (jika ada) lalu mengembalikan struct Config.
// Kalau .env tidak ditemukan, tetap lanjut memakai environment variable
// yang sudah di-set di sistem (misalnya saat deploy di server/CI).
func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("Info: file .env tidak ditemukan, memakai environment variable sistem")
	}

	cfg := &Config{
		AppName:     getEnv("APP_NAME", "API Tokoku"),
		AppEnv:      getEnv("APP_ENV", "production"),
		AppPort:     getEnv("APP_PORT", "8080"),
		AppVersion:  getEnv("APP_VERSION", "1.0.0"),
		MongoURI:    getEnv("MONGO_URI", ""),
		MongoDBName: getEnv("MONGO_DB_NAME", ""),
		JWTSecret:   getEnv("JWT_SECRET", "tokoku_super_secret_jwt_key_2026"),
		DBHost:     getEnv("DB_HOST", ""),
		DBPort:     getEnv("DB_PORT", "3306"),
		DBUser:     getEnv("DB_USER", ""),
		DBPassword: getEnv("DB_PASSWORD", ""),
		DBName:     getEnv("DB_NAME", ""),
		DBSSL:      getEnv("DB_SSL", "false") == "true",
	}

	// Validasi konfigurasi database
	if cfg.DBHost == "" && cfg.MongoURI == "" {
		log.Fatal("DB_HOST (MySQL) atau MONGO_URI wajib diisi di .env")
	}

	return cfg
}

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}
