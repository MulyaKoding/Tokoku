package repository

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/ecommerce-system/golang-api/internal/constants"
	"github.com/ecommerce-system/golang-api/internal/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type mysqlVerificationRepository struct {
	db *sql.DB
}

func NewMySQLVerificationRepository(db *sql.DB) VerificationRepository {
	return &mysqlVerificationRepository{db: db}
}

func (r *mysqlVerificationRepository) SaveCode(ctx context.Context, v *models.VerificationCode) error {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	// Hapus kode lama untuk email ini jika ada
	_, _ = r.db.ExecContext(timeoutCtx, `DELETE FROM verifications WHERE email = ?`, v.Email)

	if v.ID.IsZero() {
		v.ID = primitive.NewObjectID()
	}
	now := time.Now()
	v.CreatedAt = now
	if v.ExpiresAt.IsZero() {
		v.ExpiresAt = now.Add(10 * time.Minute)
	}

	query := `INSERT INTO verifications (id, email, code, expires_at, created_at)
	          VALUES (?, ?, ?, ?, ?)`

	_, err := r.db.ExecContext(timeoutCtx, query,
		v.ID.Hex(),
		v.Email,
		v.Code,
		v.ExpiresAt,
		v.CreatedAt,
	)
	return err
}

func (r *mysqlVerificationRepository) FindByEmailAndCode(ctx context.Context, email string, code string) (*models.VerificationCode, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	query := `SELECT id, email, code, expires_at, created_at
	          FROM verifications
	          WHERE email = ? AND code = ? AND expires_at > ?
	          LIMIT 1`

	row := r.db.QueryRowContext(timeoutCtx, query, email, code, time.Now())

	var v models.VerificationCode
	var idStr string

	if err := row.Scan(&idStr, &v.Email, &v.Code, &v.ExpiresAt, &v.CreatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrInvalidOrExpiredCode
		}
		return nil, err
	}

	if objID, err := primitive.ObjectIDFromHex(idStr); err == nil {
		v.ID = objID
	}

	return &v, nil
}

func (r *mysqlVerificationRepository) FindByEmail(ctx context.Context, email string) (*models.VerificationCode, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	query := `SELECT id, email, code, expires_at, created_at
	          FROM verifications
	          WHERE email = ?
	          ORDER BY created_at DESC
	          LIMIT 1`

	row := r.db.QueryRowContext(timeoutCtx, query, email)

	var v models.VerificationCode
	var idStr string

	if err := row.Scan(&idStr, &v.Email, &v.Code, &v.ExpiresAt, &v.CreatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrVerificationNotFound
		}
		return nil, err
	}

	if objID, err := primitive.ObjectIDFromHex(idStr); err == nil {
		v.ID = objID
	}

	return &v, nil
}

func (r *mysqlVerificationRepository) DeleteByEmail(ctx context.Context, email string) error {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	_, err := r.db.ExecContext(timeoutCtx, `DELETE FROM verifications WHERE email = ?`, email)
	return err
}

