package main

import (
	"log"
	"net/http"

	"github.com/ecommerce-system/golang-api/internal/config"
	"github.com/ecommerce-system/golang-api/internal/constants"
	"github.com/ecommerce-system/golang-api/internal/database"
	"github.com/ecommerce-system/golang-api/internal/graphql"
	"github.com/ecommerce-system/golang-api/internal/handler"
	"github.com/ecommerce-system/golang-api/internal/middleware"
	"github.com/ecommerce-system/golang-api/internal/repository"
	"github.com/ecommerce-system/golang-api/internal/response"
	"github.com/ecommerce-system/golang-api/internal/service"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load konfigurasi dari .env
	cfg := config.Load()

	// 2. Konek ke MongoDB
	db, disconnect, err := database.Connect(cfg.MongoURI, cfg.MongoDBName)
	if err != nil {
		log.Fatal("Gagal konek ke MongoDB:", err)
	}
	defer disconnect()

	// 3. Setup repository & service & handler
	productRepo := repository.NewProductRepository(db)
	productHandler := handler.NewProductHandler(productRepo)

	userRepo := repository.NewUserRepository(db)
	verificationRepo := repository.NewVerificationRepository(db)
	emailService := service.NewEmailService()

	authHandler := handler.NewAuthHandler(userRepo, verificationRepo, emailService, cfg.JWTSecret)

	// Setup GraphQL schema & handler
	graphqlSchema, err := graphql.NewSchema(productRepo, userRepo, verificationRepo, emailService, cfg.JWTSecret)
	if err != nil {
		log.Fatal("Gagal membuat skema GraphQL:", err)
	}
	graphqlHandler := handler.NewGraphQLHandler(graphqlSchema, cfg.JWTSecret)

	// 4. Setup router Gin
	router := gin.Default()

	// Middleware CORS
	router.Use(middleware.Cors())

	router.NoRoute(func(c *gin.Context) {
		response.Error(c, http.StatusNotFound, "Endpoint tidak ditemukan", nil)
	})

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "db": cfg.MongoDBName})
	})

	// Register API v1 routes (REST)
	api := router.Group(constants.ApiV1Group)
	productHandler.RegisterRoutes(api)
	authHandler.RegisterRoutes(api)

	// Register GraphQL routes (/graphql POST & GET playground)
	graphqlHandler.RegisterRoutes(router)

	// 5. Jalankan server
	addr := ":" + cfg.AppPort
	log.Println("Server berjalan di", addr)
	if err := router.Run(addr); err != nil {
		log.Fatal("Gagal menjalankan server:", err)
	}
}
