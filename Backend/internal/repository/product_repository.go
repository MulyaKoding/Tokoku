package repository

import (
	"context"
	"time"

	"github.com/ecommerce-system/golang-api/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProductRepository struct {
	collection *mongo.Collection
}

func NewProductRepository(db *mongo.Database) *ProductRepository {
	return &ProductRepository{
		collection: db.Collection("products"),
	}
}

func (r *ProductRepository) FindAll(ctx context.Context) ([]models.Product, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	cursor, err := r.collection.Find(timeoutCtx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(timeoutCtx)

	products := []models.Product{}
	if err := cursor.All(timeoutCtx, &products); err != nil {
		return nil, err
	}
	return products, nil
}

func (r *ProductRepository) FindByID(ctx context.Context, id string) (*models.Product, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	var product models.Product
	err = r.collection.FindOne(timeoutCtx, bson.M{"_id": objID}).Decode(&product)
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *ProductRepository) Create(ctx context.Context, product *models.Product) error {
	timeoutCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	product.ID = primitive.NewObjectID()
	_, err := r.collection.InsertOne(timeoutCtx, product)
	return err
}

func (r *ProductRepository) Update(ctx context.Context, id string, product *models.Product) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"name":        product.Name,
			"category":    product.Category,
			"price":       product.Price,
			"image":       product.Image,
			"description": product.Description,
			"stock":       product.Stock,
			"rating":      product.Rating,
		},
	}
	_, err = r.collection.UpdateOne(timeoutCtx, bson.M{"_id": objID}, update)
	return err
}

func (r *ProductRepository) Delete(ctx context.Context, id string) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	_, err = r.collection.DeleteOne(timeoutCtx, bson.M{"_id": objID})
	return err
}