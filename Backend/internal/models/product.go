package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Product struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name        string             `bson:"name" json:"name"`
	Category    string             `bson:"category" json:"category"`
	Price       float64            `bson:"price" json:"price"`
	Image       string             `bson:"image" json:"image"`
	Description string             `bson:"description" json:"description"`
	Stock       int                `bson:"stock" json:"stock"`
	Rating      float64            `bson:"rating" json:"rating"`
}