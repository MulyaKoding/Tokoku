package graphql

import (
	"github.com/ecommerce-system/golang-api/internal/models"
	"github.com/graphql-go/graphql"
)

// ProductType mendefinisikan skema GraphQL Object Type untuk Product
var ProductType = graphql.NewObject(graphql.ObjectConfig{
	Name:        "Product",
	Description: "Model data produk dalam sistem Tokoku",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.ID),
			Description: "ID unik produk (ObjectID hex string)",
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				if prod, ok := p.Source.(models.Product); ok {
					return prod.ID.Hex(), nil
				}
				if prod, ok := p.Source.(*models.Product); ok && prod != nil {
					return prod.ID.Hex(), nil
				}
				return nil, nil
			},
		},
		"name": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Nama produk",
		},
		"category": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.String),
			Description: "Kategori produk",
		},
		"price": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.Float),
			Description: "Harga produk",
		},
		"image": &graphql.Field{
			Type:        graphql.String,
			Description: "URL gambar produk",
		},
		"description": &graphql.Field{
			Type:        graphql.String,
			Description: "Deskripsi detail produk",
		},
		"stock": &graphql.Field{
			Type:        graphql.Int,
			Description: "Jumlah stok produk",
		},
		"rating": &graphql.Field{
			Type:        graphql.Float,
			Description: "Rating produk (skala 0 - 5)",
		},
	},
})

// CreateProductInputType mendefinisikan input payload saat membuat produk
var CreateProductInputType = graphql.NewInputObject(graphql.InputObjectConfig{
	Name:        "CreateProductInput",
	Description: "Input untuk membuat produk baru",
	Fields: graphql.InputObjectConfigFieldMap{
		"name": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"category": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"price": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.Float),
		},
		"image": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"description": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"stock": &graphql.InputObjectFieldConfig{
			Type: graphql.Int,
		},
		"rating": &graphql.InputObjectFieldConfig{
			Type: graphql.Float,
		},
	},
})

// UpdateProductInputType mendefinisikan input payload saat memperbarui produk
var UpdateProductInputType = graphql.NewInputObject(graphql.InputObjectConfig{
	Name:        "UpdateProductInput",
	Description: "Input untuk memperbarui data produk",
	Fields: graphql.InputObjectConfigFieldMap{
		"name": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"category": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"price": &graphql.InputObjectFieldConfig{
			Type: graphql.Float,
		},
		"image": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"description": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"stock": &graphql.InputObjectFieldConfig{
			Type: graphql.Int,
		},
		"rating": &graphql.InputObjectFieldConfig{
			Type: graphql.Float,
		},
	},
})

// DeleteProductResponseType mendefinisikan respons penghapusan produk
var DeleteProductResponseType = graphql.NewObject(graphql.ObjectConfig{
	Name: "DeleteProductResponse",
	Fields: graphql.Fields{
		"success": &graphql.Field{
			Type: graphql.Boolean,
		},
		"message": &graphql.Field{
			Type: graphql.String,
		},
		"id": &graphql.Field{
			Type: graphql.String,
		},
	},
})

// UserType mendefinisikan skema GraphQL Object Type untuk User
var UserType = graphql.NewObject(graphql.ObjectConfig{
	Name:        "User",
	Description: "Model data pengguna Tokoku",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				if u, ok := p.Source.(models.User); ok {
					return u.ID.Hex(), nil
				}
				if u, ok := p.Source.(*models.User); ok && u != nil {
					return u.ID.Hex(), nil
				}
				return nil, nil
			},
		},
		"name": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"email": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"role": &graphql.Field{
			Type: graphql.String,
		},
		"avatar": &graphql.Field{
			Type: graphql.String,
		},
		"created_at": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				if u, ok := p.Source.(models.User); ok {
					return u.CreatedAt.Format("2006-01-02T15:04:05Z07:00"), nil
				}
				if u, ok := p.Source.(*models.User); ok && u != nil {
					return u.CreatedAt.Format("2006-01-02T15:04:05Z07:00"), nil
				}
				return nil, nil
			},
		},
	},
})

// AuthPayloadType mendefinisikan payload return login & register GraphQL
var AuthPayloadType = graphql.NewObject(graphql.ObjectConfig{
	Name: "AuthPayload",
	Fields: graphql.Fields{
		"token": &graphql.Field{
			Type: graphql.String,
		},
		"user": &graphql.Field{
			Type: UserType,
		},
	},
})

// RequestRegisterResponseType mendefinisikan respons pengiriman kode OTP
var RequestRegisterResponseType = graphql.NewObject(graphql.ObjectConfig{
	Name: "RequestRegisterResponse",
	Fields: graphql.Fields{
		"success": &graphql.Field{
			Type: graphql.Boolean,
		},
		"message": &graphql.Field{
			Type: graphql.String,
		},
		"email": &graphql.Field{
			Type: graphql.String,
		},
		"debug_otp": &graphql.Field{
			Type: graphql.String,
		},
	},
})
