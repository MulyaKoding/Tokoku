package repository

import (
	"context"
	"errors"

	"github.com/ecommerce-system/golang-api/internal/constants"
	apperrors "github.com/ecommerce-system/golang-api/internal/errors"
	"github.com/ecommerce-system/golang-api/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// ProductRepository mendefinisikan antarmuka kontak repository produk
type ProductRepository interface {
	FindAll(ctx context.Context) ([]models.Product, error)
	FindByID(ctx context.Context, id string) (*models.Product, error)
	Create(ctx context.Context, product *models.Product) error
	Update(ctx context.Context, id string, product *models.Product) error
	Delete(ctx context.Context, id string) error
}

type mongoProductRepository struct {
	collection *mongo.Collection
}

// NewProductRepository membuat instance baru ProductRepository
func NewProductRepository(db *mongo.Database) ProductRepository {
	return &mongoProductRepository{
		collection: db.Collection(constants.CollectionProducts),
	}
}

func (r *mongoProductRepository) FindAll(ctx context.Context) ([]models.Product, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
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

func (r *mongoProductRepository) FindByID(ctx context.Context, id string) (*models.Product, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, apperrors.ErrInvalidID
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	var product models.Product
	err = r.collection.FindOne(timeoutCtx, bson.M{"_id": objID}).Decode(&product)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, apperrors.ErrProductNotFound
		}
		return nil, err
	}
	return &product, nil
}

func (r *mongoProductRepository) Create(ctx context.Context, product *models.Product) error {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	product.ID = primitive.NewObjectID()
	_, err := r.collection.InsertOne(timeoutCtx, product)
	return err
}

func (r *mongoProductRepository) Update(ctx context.Context, id string, product *models.Product) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return apperrors.ErrInvalidID
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
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
	res, err := r.collection.UpdateOne(timeoutCtx, bson.M{"_id": objID}, update)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return apperrors.ErrProductNotFound
	}
	return nil
}

func (r *mongoProductRepository) Delete(ctx context.Context, id string) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return apperrors.ErrInvalidID
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	res, err := r.collection.DeleteOne(timeoutCtx, bson.M{"_id": objID})
	if err != nil {
		return err
	}
	if res.DeletedCount == 0 {
		return apperrors.ErrProductNotFound
	}
	return nil
}