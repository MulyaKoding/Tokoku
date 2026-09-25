package repository

import (
	"context"
	"errors"
	"time"

	"github.com/ecommerce-system/golang-api/internal/constants"
	"github.com/ecommerce-system/golang-api/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	ErrInvalidOrExpiredCode = errors.New("kode verifikasi salah atau sudah kadaluarsa")
	ErrVerificationNotFound = errors.New("tidak ada permintaan verifikasi untuk email ini")
)

type VerificationRepository interface {
	SaveCode(ctx context.Context, v *models.VerificationCode) error
	FindByEmailAndCode(ctx context.Context, email string, code string) (*models.VerificationCode, error)
	FindByEmail(ctx context.Context, email string) (*models.VerificationCode, error)
	DeleteByEmail(ctx context.Context, email string) error
}

type mongoVerificationRepository struct {
	collection *mongo.Collection
}

func NewVerificationRepository(db *mongo.Database) VerificationRepository {
	return &mongoVerificationRepository{
		collection: db.Collection(constants.CollectionVerificationCodes),
	}
}

func (r *mongoVerificationRepository) SaveCode(ctx context.Context, v *models.VerificationCode) error {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	// Hapus entri lama untuk email ini jika ada
	_, _ = r.collection.DeleteMany(timeoutCtx, bson.M{"email": v.Email})

	v.ID = primitive.NewObjectID()
	v.CreatedAt = time.Now()
	// Default expiry 10 menit
	if v.ExpiresAt.IsZero() {
		v.ExpiresAt = v.CreatedAt.Add(10 * time.Minute)
	}

	_, err := r.collection.InsertOne(timeoutCtx, v)
	return err
}

func (r *mongoVerificationRepository) FindByEmailAndCode(ctx context.Context, email string, code string) (*models.VerificationCode, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	var record models.VerificationCode
	err := r.collection.FindOne(timeoutCtx, bson.M{
		"email":      email,
		"code":       code,
		"expires_at": bson.M{"$gt": time.Now()},
	}).Decode(&record)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrInvalidOrExpiredCode
		}
		return nil, err
	}
	return &record, nil
}

func (r *mongoVerificationRepository) FindByEmail(ctx context.Context, email string) (*models.VerificationCode, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	var record models.VerificationCode
	err := r.collection.FindOne(timeoutCtx, bson.M{
		"email": email,
	}, options.FindOne().SetSort(bson.M{"created_at": -1})).Decode(&record)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrVerificationNotFound
		}
		return nil, err
	}
	return &record, nil
}

func (r *mongoVerificationRepository) DeleteByEmail(ctx context.Context, email string) error {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	_, err := r.collection.DeleteMany(timeoutCtx, bson.M{"email": email})
	return err
}
