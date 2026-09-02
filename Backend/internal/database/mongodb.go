package database

import (
	"context"
	"log"
	"time"

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

	return client.Database(dbName), disconnect, nil
}
