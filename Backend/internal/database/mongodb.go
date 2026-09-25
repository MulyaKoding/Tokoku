package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Connect membuka koneksi ke MongoDB Atlas dan mengembalikan
// referensi ke database yang dipakai (misal: "e_commerce").
func Connect(uri, dbName string) (*mongo.Database, func(), error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return nil, nil, err
	}

	// Ping untuk memastikan koneksi benar-benar berhasil
	pingCtx, pingCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer pingCancel()
	if err := client.Ping(pingCtx, nil); err != nil {
		return nil, nil, err
	}

	log.Println("Berhasil konek ke MongoDB, database:", dbName)

	disconnect := func() {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := client.Disconnect(ctx); err != nil {
			log.Println("Gagal disconnect MongoDB:", err)
		}
	}

	db := client.Database(dbName)
	if err := InitCollections(db); err != nil {
		log.Println("Warning inisialisasi collection:", err)
	}

	return db, disconnect, nil
}

// InitCollections memastikan koleksi dan indeks (seperti unique index email pada users) sudah terbuat di MongoDB
func InitCollections(db *mongo.Database) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	userCollection := db.Collection("users")

	// Buat index unique pada field email di collection users
	indexModel := mongo.IndexModel{
		Keys:    bson.M{"email": 1},
		Options: options.Index().SetUnique(true),
	}
	_, err := userCollection.Indexes().CreateOne(ctx, indexModel)
	if err != nil {
		log.Printf("Catatan index users: %v\n", err)
	}

	return nil
}
