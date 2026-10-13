package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/ecommerce-system/golang-api/internal/constants"
	apperrors "github.com/ecommerce-system/golang-api/internal/errors"
	"github.com/ecommerce-system/golang-api/internal/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type mysqlProductRepository struct {
	db *sql.DB
}

func NewMySQLProductRepository(db *sql.DB) ProductRepository {
	return &mysqlProductRepository{db: db}
}

func (r *mysqlProductRepository) FindAll(ctx context.Context) ([]models.Product, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	query := `SELECT id, name, category, price, image, description, stock, rating FROM products`
	rows, err := r.db.QueryContext(timeoutCtx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	products := []models.Product{}
	for rows.Next() {
		var p models.Product
		var idStr string
		var category, image, description sql.NullString

		if err := rows.Scan(
			&idStr,
			&p.Name,
			&category,
			&p.Price,
			&image,
			&description,
			&p.Stock,
			&p.Rating,
		); err != nil {
			return nil, err
		}

		if objID, err := primitive.ObjectIDFromHex(idStr); err == nil {
			p.ID = objID
		}
		if category.Valid {
			p.Category = category.String
		}
		if image.Valid {
			p.Image = image.String
		}
		if description.Valid {
			p.Description = description.String
		}

		products = append(products, p)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	return products, nil
}

func (r *mysqlProductRepository) FindByID(ctx context.Context, id string) (*models.Product, error) {
	if _, err := primitive.ObjectIDFromHex(id); err != nil {
		return nil, apperrors.ErrInvalidID
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	query := `SELECT id, name, category, price, image, description, stock, rating FROM products WHERE id = ? LIMIT 1`
	row := r.db.QueryRowContext(timeoutCtx, query, id)

	var p models.Product
	var idStr string
	var category, image, description sql.NullString

	if err := row.Scan(
		&idStr,
		&p.Name,
		&category,
		&p.Price,
		&image,
		&description,
		&p.Stock,
		&p.Rating,
	); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperrors.ErrProductNotFound
		}
		return nil, err
	}

	if objID, err := primitive.ObjectIDFromHex(idStr); err == nil {
		p.ID = objID
	}
	if category.Valid {
		p.Category = category.String
	}
	if image.Valid {
		p.Image = image.String
	}
	if description.Valid {
		p.Description = description.String
	}

	return &p, nil
}

func (r *mysqlProductRepository) Create(ctx context.Context, product *models.Product) error {
	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	if product.ID.IsZero() {
		product.ID = primitive.NewObjectID()
	}

	query := `INSERT INTO products (id, name, category, price, image, description, stock, rating) 
	          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := r.db.ExecContext(timeoutCtx, query,
		product.ID.Hex(),
		product.Name,
		product.Category,
		product.Price,
		product.Image,
		product.Description,
		product.Stock,
		product.Rating,
	)
	return err
}

func (r *mysqlProductRepository) Update(ctx context.Context, id string, product *models.Product) error {
	if _, err := primitive.ObjectIDFromHex(id); err != nil {
		return apperrors.ErrInvalidID
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	query := `UPDATE products 
	          SET name = ?, category = ?, price = ?, image = ?, description = ?, stock = ?, rating = ? 
	          WHERE id = ?`

	res, err := r.db.ExecContext(timeoutCtx, query,
		product.Name,
		product.Category,
		product.Price,
		product.Image,
		product.Description,
		product.Stock,
		product.Rating,
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
		// Cek apakah produknya memang ada tapi data tidak berubah
		var exists int
		checkErr := r.db.QueryRowContext(timeoutCtx, `SELECT 1 FROM products WHERE id = ? LIMIT 1`, id).Scan(&exists)
		if checkErr != nil {
			if errors.Is(checkErr, sql.ErrNoRows) {
				return apperrors.ErrProductNotFound
			}
			return checkErr
		}
	}

	return nil
}

func (r *mysqlProductRepository) Delete(ctx context.Context, id string) error {
	if _, err := primitive.ObjectIDFromHex(id); err != nil {
		return apperrors.ErrInvalidID
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, constants.DefaultQueryTimeout)
	defer cancel()

	query := `DELETE FROM products WHERE id = ?`
	res, err := r.db.ExecContext(timeoutCtx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return apperrors.ErrProductNotFound
	}

	return nil
}

