package repository

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/ecommerce-system/golang-api/internal/constants"
	apperrors "github.com/ecommerce-system/golang-api/internal/errors"
	"github.com/ecommerce-system/golang-api/internal/models"
	"github.com/go-sql-driver/mysql"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type mysqlUserRepository struct {
	db *sql.DB
}

func NewMySQLUserRepository(db *sql.DB) UserRepository {
	return &mysqlUserRepository{db: db}
}

func (r *mysqlUserRepository) Create(ctx context.Context, user *models.User) error {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	now := time.Now()
	if user.ID.IsZero() {
		user.ID = primitive.NewObjectID()
	}
	user.CreatedAt = now
	user.UpdatedAt = now
	if user.Role == "" {
		user.Role = "user"
	}

	query := `INSERT INTO users (id, name, email, password, role, avatar, created_at, updated_at, is_verified)
	          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := r.db.ExecContext(timeoutCtx, query,
		user.ID.Hex(),
		user.Name,
		user.Email,
		user.Password,
		user.Role,
		user.Avatar,
		user.CreatedAt,
		user.UpdatedAt,
		user.IsVerified,
	)
	if err != nil {
		var mysqlErr *mysql.MySQLError
		if errors.As(err, &mysqlErr) && mysqlErr.Number == 1062 {
			return ErrUserAlreadyExists
		}
		return err
	}

	return nil
}

func (r *mysqlUserRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	query := `SELECT id, name, email, password, role, avatar, created_at, updated_at, is_verified
	          FROM users WHERE email = ? LIMIT 1`
	row := r.db.QueryRowContext(timeoutCtx, query, email)

	var u models.User
	var idStr string
	var avatar sql.NullString

	if err := row.Scan(
		&idStr,
		&u.Name,
		&u.Email,
		&u.Password,
		&u.Role,
		&avatar,
		&u.CreatedAt,
		&u.UpdatedAt,
		&u.IsVerified,
	); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	if objID, err := primitive.ObjectIDFromHex(idStr); err == nil {
		u.ID = objID
	}
	if avatar.Valid {
		u.Avatar = avatar.String
	}

	return &u, nil
}

func (r *mysqlUserRepository) FindByID(ctx context.Context, id string) (*models.User, error) {
	if _, err := primitive.ObjectIDFromHex(id); err != nil {
		return nil, apperrors.ErrInvalidID
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	query := `SELECT id, name, email, password, role, avatar, created_at, updated_at, is_verified
	          FROM users WHERE id = ? LIMIT 1`
	row := r.db.QueryRowContext(timeoutCtx, query, id)

	var u models.User
	var idStr string
	var avatar sql.NullString

	if err := row.Scan(
		&idStr,
		&u.Name,
		&u.Email,
		&u.Password,
		&u.Role,
		&avatar,
		&u.CreatedAt,
		&u.UpdatedAt,
		&u.IsVerified,
	); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	if objID, err := primitive.ObjectIDFromHex(idStr); err == nil {
		u.ID = objID
	}
	if avatar.Valid {
		u.Avatar = avatar.String
	}

	return &u, nil
}

func (r *mysqlUserRepository) Update(ctx context.Context, id string, user *models.User) error {
	if _, err := primitive.ObjectIDFromHex(id); err != nil {
		return apperrors.ErrInvalidID
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	user.UpdatedAt = time.Now()
	query := `UPDATE users SET name = ?, avatar = ?, role = ?, updated_at = ? WHERE id = ?`

	res, err := r.db.ExecContext(timeoutCtx, query,
		user.Name,
		user.Avatar,
		user.Role,
		user.UpdatedAt,
		id,
	)
	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		var exists int
		checkErr := r.db.QueryRowContext(timeoutCtx, `SELECT 1 FROM users WHERE id = ? LIMIT 1`, id).Scan(&exists)
		if checkErr != nil {
			if errors.Is(checkErr, sql.ErrNoRows) {
				return ErrUserNotFound
			}
			return checkErr
		}
	}

	return nil
}

