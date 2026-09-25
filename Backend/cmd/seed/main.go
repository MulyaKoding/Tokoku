package main

import (
	"context"
	"log"
	"time"

	"github.com/ecommerce-system/golang-api/internal/config"
	"github.com/ecommerce-system/golang-api/internal/database"
	"github.com/ecommerce-system/golang-api/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	cfg := config.Load()

	db, disconnect, err := database.Connect(cfg.MongoURI, cfg.MongoDBName)
	if err != nil {
		log.Fatal("Gagal konek ke MongoDB:", err)
	}
	defer disconnect()

	collection := db.Collection("products")

	// Hapus semua data lama dulu supaya tidak duplikat
	deleteResult, err := collection.DeleteMany(context.Background(), bson.M{})
	if err != nil {
		log.Fatal("Gagal menghapus data lama:", err)
	}
	log.Printf("Menghapus %d data lama\n", deleteResult.DeletedCount)

	products := []interface{}{
		models.Product{
			Name: "Polaroid OneStep 2", Category: "Kamera", Price: 1850000,
			Image:       "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
			Description: "Kamera instan dengan lensa autofocus, flash otomatis, dan desain retro yang ikonik. Cocok untuk momen spontan sehari-hari.",
			Stock:       12, Rating: 4.7,
		},
		models.Product{
			Name: "Studio Headphone Pro", Category: "Audio", Price: 950000,
			Image:       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
			Description: "Headphone over-ear dengan active noise cancelling, baterai tahan hingga 30 jam, dan suara jernih untuk studio maupun harian.",
			Stock:       20, Rating: 4.5,
		},
		models.Product{
			Name: "Smartwatch Fit Series", Category: "Wearable", Price: 1250000,
			Image:       "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
			Description: "Smartwatch dengan pelacak detak jantung, SpO2, mode olahraga, dan baterai tahan 7 hari.",
			Stock:       15, Rating: 4.6,
		},
		models.Product{
			Name: "Mechanical Keyboard Aksesori", Category: "Aksesori", Price: 750000,
			Image:       "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
			Description: "Keyboard mekanik hot-swappable dengan switch tactile, backlight RGB, dan konektivitas wireless dual-mode.",
			Stock:       25, Rating: 4.4,
		},
		models.Product{
			Name: "UltraBook 14 Pro", Category: "Laptop", Price: 12500000,
			Image:       "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
			Description: "Laptop tipis dan ringan dengan performa tinggi, layar 14 inci resolusi tajam, dan baterai seharian penuh.",
			Stock:       8, Rating: 4.8,
		},
		models.Product{
			Name: "Smartphone X200", Category: "Smartphone", Price: 4500000,
			Image:       "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
			Description: "Smartphone dengan kamera triple 108MP, layar AMOLED 120Hz, dan pengisian cepat 65W.",
			Stock:       18, Rating: 4.5,
		},
		models.Product{
			Name: "Gamepad Elite Wireless", Category: "Gaming", Price: 899000,
			Image:       "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?w=800&q=80",
			Description: "Gamepad wireless dengan trigger adaptif, haptic feedback, dan kompatibel multi-platform.",
			Stock:       30, Rating: 4.3,
		},
		models.Product{
			Name: "Portable Speaker Boom", Category: "Speaker", Price: 650000,
			Image:       "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
			Description: "Speaker portabel tahan air IPX7 dengan bass kuat dan baterai hingga 20 jam pemakaian.",
			Stock:       22, Rating: 4.4,
		},
		models.Product{
			Name: "AeroDrone 4K", Category: "Drone", Price: 6200000,
			Image:       "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
			Description: "Drone kamera 4K dengan gimbal 3-axis, waktu terbang 34 menit, dan mode obstacle avoidance.",
			Stock:       6, Rating: 4.6,
		},
		models.Product{
			Name: `Monitor UltraWide 27"`, Category: "Monitor", Price: 3400000,
			Image:       "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
			Description: "Monitor ultrawide 27 inci resolusi QHD, refresh rate 144Hz, ideal untuk kerja multitasking dan gaming.",
			Stock:       10, Rating: 4.7,
		},
	}

	result, err := collection.InsertMany(context.Background(), products)
	if err != nil {
		log.Fatal("Gagal insert data produk:", err)
	}
	log.Printf("Berhasil insert %d produk ke collection 'products'\n", len(result.InsertedIDs))

	// Seed data users ke collection 'users'
	userCollection := db.Collection("users")
	delUsersResult, err := userCollection.DeleteMany(context.Background(), bson.M{})
	if err != nil {
		log.Println("Gagal membersihkan data user lama:", err)
	} else {
		log.Printf("Menghapus %d user lama\n", delUsersResult.DeletedCount)
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	users := []interface{}{
		models.User{
			Name:      "Administrator TokoKu",
			Email:     "admin@tokoku.com",
			Password:  string(hashedPassword),
			Role:      "admin",
			Avatar:    "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		models.User{
			Name:      "Budi Santoso",
			Email:     "budi@tokoku.com",
			Password:  string(hashedPassword),
			Role:      "user",
			Avatar:    "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}

	userResult, err := userCollection.InsertMany(context.Background(), users)
	if err != nil {
		log.Fatal("Gagal insert data user:", err)
	}
	log.Printf("Berhasil insert %d user ke collection 'users'\n", len(userResult.InsertedIDs))
}