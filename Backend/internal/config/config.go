package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv     string
	AppPort    string
	MongoURI   string
	MongoDBName string
}

// Load membaca file .env (jika ada) lalu mengembalikan struct Config.
// Kalau .env tidak ditemukan, tetap lanjut memakai environment variable
// yang sudah di-set di sistem (misalnya saat deploy di server/CI).
func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("Info: file .env tidak ditemukan, memakai environment variable sistem")
	}

	cfg := &Config{
		AppEnv:      getEnv("APP_ENV", "development"),
		AppPort:     getEnv("APP_PORT", "8080"),
		MongoURI:    getEnv("MONGO_URI", ""),
		MongoDBName: getEnv("MONGO_DB_NAME", ""),
	}

	if cfg.MongoURI == "" {
		log.Fatal("MONGO_URI wajib diisi di .env")
	}
	if cfg.MongoDBName == "" {
		log.Fatal("MONGO_DB_NAME wajib diisi di .env")
	}

	return cfg
}

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}
