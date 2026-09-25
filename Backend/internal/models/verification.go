package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// VerificationCode menyimpan kode OTP sementara beserta data pendaftaran
type VerificationCode struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email     string             `bson:"email" json:"email"`
	Code      string             `bson:"code" json:"code"`
	Name      string             `bson:"name" json:"name"`
	Password  string             `bson:"password" json:"-"`
	ExpiresAt time.Time          `bson:"expires_at" json:"expires_at"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}

type RequestRegisterRequest struct {
	Name     string `json:"name" binding:"required,min=2"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type VerifyRegisterRequest struct {
	Email string `json:"email" binding:"required,email"`
	Code  string `json:"code" binding:"required,len=6"`
}

type ResendCodeRequest struct {
	Email string `json:"email" binding:"required,email"`
}
