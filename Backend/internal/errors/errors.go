package apperrors

import "errors"

var (
	ErrProductNotFound   = errors.New("produk tidak ditemukan")
	ErrInvalidID         = errors.New("format ID produk tidak valid")
	ErrDatabaseOperation = errors.New("terjadi kesalahan pada operasi database")
	ErrInvalidPayload    = errors.New("data payload yang dikirim tidak valid")
)

