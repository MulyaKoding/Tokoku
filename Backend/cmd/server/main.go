package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/ecommerce-system/golang-api/internal/config"
	"github.com/ecommerce-system/golang-api/internal/database"
	"github.com/ecommerce-system/golang-api/internal/handler"
	"github.com/ecommerce-system/golang-api/internal/repository"
)

func main() {
	// 1. Load konfigurasi dari .env
	cfg := config.Load()

	// 2. Konek ke MongoDB (database "e_commerce")
	db, disconnect, err := database.Connect(cfg.MongoURI, cfg.MongoDBName)
	if err != nil {
		log.Fatal("Gagal konek ke MongoDB:", err)
	}
	defer disconnect()

	// 3. Setup repository & handler
	productRepo := repository.NewProductRepository(db)
	productHandler := handler.NewProductHandler(productRepo)

	// 4. Setup router Gin
	router := gin.Default()

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "db": cfg.MongoDBName})
	})

	api := router.Group("/api/v1")
	productHandler.RegisterRoutes(api)

	// 5. Jalankan server
	addr := ":" + cfg.AppPort
	log.Println("Server berjalan di", addr)
	if err := router.Run(addr); err != nil {
		log.Fatal("Gagal menjalankan server:", err)
	}
}
