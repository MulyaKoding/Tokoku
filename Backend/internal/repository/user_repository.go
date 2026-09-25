package repository

import (
	"context"
	"errors"
	"time"

	"github.com/ecommerce-system/golang-api/internal/constants"
	apperrors "github.com/ecommerce-system/golang-api/internal/errors"
	"github.com/ecommerce-system/golang-api/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	ErrUserNotFound      = errors.New("user tidak ditemukan")
	ErrUserAlreadyExists = errors.New("email sudah terdaftar")
)

type UserRepository interface {
	Create(ctx context.Context, user *models.User) error
	FindByEmail(ctx context.Context, email string) (*models.User, error)
	FindByID(ctx context.Context, id string) (*models.User, error)
	Update(ctx context.Context, id string, user *models.User) error
}

type mongoUserRepository struct {
	collection *mongo.Collection
}

func NewUserRepository(db *mongo.Database) UserRepository {
	return &mongoUserRepository{
		collection: db.Collection(constants.CollectionUsers),
	}
}

func (r *mongoUserRepository) Create(ctx context.Context, user *models.User) error {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	// Cek apakah email sudah terdaftar
	existingUser := models.User{}
	err := r.collection.FindOne(timeoutCtx, bson.M{"email": user.Email}).Decode(&existingUser)
	if err == nil {
		return ErrUserAlreadyExists
	} else if !errors.Is(err, mongo.ErrNoDocuments) {
		return err
	}

	now := time.Now()
	user.ID = primitive.NewObjectID()
	user.CreatedAt = now
	user.UpdatedAt = now
	if user.Role == "" {
		user.Role = "user"
	}

	_, err = r.collection.InsertOne(timeoutCtx, user)
	return err
}

func (r *mongoUserRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	var user models.User
	err := r.collection.FindOne(timeoutCtx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return &user, nil
}

func (r *mongoUserRepository) FindByID(ctx context.Context, id string) (*models.User, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, apperrors.ErrInvalidID
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	var user models.User
	err = r.collection.FindOne(timeoutCtx, bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return &user, nil
}

func (r *mongoUserRepository) Update(ctx context.Context, id string, user *models.User) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return apperrors.ErrInvalidID
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	user.UpdatedAt = time.Now()
	update := bson.M{
		"$set": bson.M{
			"name":       user.Name,
			"avatar":     user.Avatar,
			"role":       user.Role,
			"updated_at": user.UpdatedAt,
		},
	}

	res, err := r.collection.UpdateOne(timeoutCtx, bson.M{"_id": objID}, update)
	if err != nil {
		return err
	}
	if res.MatchedCount == 0 {
		return ErrUserNotFound
	}
	return nil
}
