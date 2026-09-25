package graphql

import (
	"context"
	"errors"

	"github.com/ecommerce-system/golang-api/internal/models"
	"github.com/ecommerce-system/golang-api/internal/repository"
	"github.com/ecommerce-system/golang-api/internal/service"
	"github.com/ecommerce-system/golang-api/internal/utils"
	"github.com/graphql-go/graphql"
	"golang.org/x/crypto/bcrypt"
)

// NewSchema menginisialisasi GraphQL Schema yang berisi query dan mutation untuk produk & auth user
func NewSchema(
	productRepo repository.ProductRepository,
	userRepo repository.UserRepository,
	verificationRepo repository.VerificationRepository,
	emailService service.EmailService,
	jwtSecret string,
) (graphql.Schema, error) {
	rootQuery := graphql.NewObject(graphql.ObjectConfig{
		Name: "RootQuery",
		Fields: graphql.Fields{
			"products": &graphql.Field{
				Type:        graphql.NewList(ProductType),
				Description: "Mengambil semua daftar produk",
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					ctx := p.Context
					if ctx == nil {
						ctx = context.Background()
					}
					return productRepo.FindAll(ctx)
				},
			},
			"product": &graphql.Field{
				Type:        ProductType,
				Description: "Mengambil detail produk berdasarkan ID",
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					id, ok := p.Args["id"].(string)
					if !ok || id == "" {
						return nil, errors.New("id produk diperlukan")
					}
					ctx := p.Context
					if ctx == nil {
						ctx = context.Background()
					}
					return productRepo.FindByID(ctx, id)
				},
			},
			"me": &graphql.Field{
				Type:        UserType,
				Description: "Mengambil data profil user yang sedang login",
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					ctx := p.Context
					if ctx == nil {
						return nil, errors.New("unauthorized")
					}
					userID, ok := ctx.Value("user_id").(string)
					if !ok || userID == "" {
						return nil, errors.New("unauthorized: silakan login terlebih dahulu")
					}
					if userRepo == nil {
						return nil, errors.New("user repository tidak tersedia")
					}
					return userRepo.FindByID(ctx, userID)
				},
			},
		},
	})

	rootMutation := graphql.NewObject(graphql.ObjectConfig{
		Name: "RootMutation",
		Fields: graphql.Fields{
			"createProduct": &graphql.Field{
				Type:        ProductType,
				Description: "Menambahkan produk baru",
				Args: graphql.FieldConfigArgument{
					"input": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(CreateProductInputType),
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					inputMap, ok := p.Args["input"].(map[string]interface{})
					if !ok {
						return nil, errors.New("input tidak valid")
					}

					product := models.Product{
						Name:     getString(inputMap, "name"),
						Category: getString(inputMap, "category"),
						Price:    getFloat(inputMap, "price"),
					}

					if img, ok := inputMap["image"].(string); ok {
						product.Image = img
					}
					if desc, ok := inputMap["description"].(string); ok {
						product.Description = desc
					}
					if stock, ok := inputMap["stock"].(int); ok {
						product.Stock = stock
					}
					if rating, ok := inputMap["rating"].(float64); ok {
						product.Rating = rating
					}

					ctx := p.Context
					if ctx == nil {
						ctx = context.Background()
					}

					if err := productRepo.Create(ctx, &product); err != nil {
						return nil, err
					}

					return product, nil
				},
			},
			"updateProduct": &graphql.Field{
				Type:        ProductType,
				Description: "Memperbarui data produk",
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"input": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(UpdateProductInputType),
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					id, ok := p.Args["id"].(string)
					if !ok || id == "" {
						return nil, errors.New("id produk diperlukan")
					}

					inputMap, ok := p.Args["input"].(map[string]interface{})
					if !ok {
						return nil, errors.New("input tidak valid")
					}

					ctx := p.Context
					if ctx == nil {
						ctx = context.Background()
					}

					existing, err := productRepo.FindByID(ctx, id)
					if err != nil {
						return nil, err
					}

					if name, ok := inputMap["name"].(string); ok && name != "" {
						existing.Name = name
					}
					if category, ok := inputMap["category"].(string); ok && category != "" {
						existing.Category = category
					}
					if price, ok := inputMap["price"].(float64); ok {
						existing.Price = price
					}
					if image, ok := inputMap["image"].(string); ok {
						existing.Image = image
					}
					if desc, ok := inputMap["description"].(string); ok {
						existing.Description = desc
					}
					if stock, ok := inputMap["stock"].(int); ok {
						existing.Stock = stock
					}
					if rating, ok := inputMap["rating"].(float64); ok {
						existing.Rating = rating
					}

					if err := productRepo.Update(ctx, id, existing); err != nil {
						return nil, err
					}

					return existing, nil
				},
			},
			"deleteProduct": &graphql.Field{
				Type:        DeleteProductResponseType,
				Description: "Menghapus produk berdasarkan ID",
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					id, ok := p.Args["id"].(string)
					if !ok || id == "" {
						return nil, errors.New("id produk diperlukan")
					}

					ctx := p.Context
					if ctx == nil {
						ctx = context.Background()
					}

					if err := productRepo.Delete(ctx, id); err != nil {
						return map[string]interface{}{
							"success": false,
							"message": err.Error(),
							"id":      id,
						}, err
					}

					return map[string]interface{}{
						"success": true,
						"message": "Produk berhasil dihapus",
						"id":      id,
					}, nil
				},
			},
			"requestRegister": &graphql.Field{
				Type:        RequestRegisterResponseType,
				Description: "Mengirimkan kode OTP 6-digit ke email",
				Args: graphql.FieldConfigArgument{
					"name": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"email": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"password": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					if userRepo == nil || verificationRepo == nil || emailService == nil {
						return nil, errors.New("layanan tidak siap")
					}

					name := p.Args["name"].(string)
					email := p.Args["email"].(string)
					password := p.Args["password"].(string)

					ctx := p.Context
					if ctx == nil {
						ctx = context.Background()
					}

					existing, err := userRepo.FindByEmail(ctx, email)
					if err == nil && existing != nil {
						return nil, errors.New("email sudah terdaftar")
					}

					hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
					if err != nil {
						return nil, err
					}

					otp := emailService.GenerateOTP()
					ver := models.VerificationCode{
						Email:    email,
						Code:     otp,
						Name:     name,
						Password: string(hashedPassword),
					}

					if err := verificationRepo.SaveCode(ctx, &ver); err != nil {
						return nil, err
					}

					_ = emailService.SendVerificationEmail(email, name, otp)

					return map[string]interface{}{
						"success":   true,
						"message":   "Kode OTP telah dikirim ke email",
						"email":     email,
						"debug_otp": otp,
					}, nil
				},
			},
			"verifyRegister": &graphql.Field{
				Type:        AuthPayloadType,
				Description: "Verifikasi OTP dan aktivasi user",
				Args: graphql.FieldConfigArgument{
					"email": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"code": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					if userRepo == nil || verificationRepo == nil {
						return nil, errors.New("layanan tidak siap")
					}

					email := p.Args["email"].(string)
					code := p.Args["code"].(string)

					ctx := p.Context
					if ctx == nil {
						ctx = context.Background()
					}

					ver, err := verificationRepo.FindByEmailAndCode(ctx, email, code)
					if err != nil {
						return nil, errors.New("kode verifikasi salah atau kadaluarsa")
					}

					user := models.User{
						Name:       ver.Name,
						Email:      ver.Email,
						Password:   ver.Password,
						Role:       "user",
						Avatar:     "https://api.dicebear.com/7.x/avataaars/svg?seed=" + ver.Name,
						IsVerified: true,
					}

					if err := userRepo.Create(ctx, &user); err != nil {
						return nil, err
					}

					_ = verificationRepo.DeleteByEmail(ctx, email)

					token, err := utils.GenerateToken(&user, jwtSecret)
					if err != nil {
						return nil, err
					}

					return map[string]interface{}{
						"token": token,
						"user":  user,
					}, nil
				},
			},
			"register": &graphql.Field{
				Type:        AuthPayloadType,
				Description: "Mendaftarkan user baru secara langsung",
				Args: graphql.FieldConfigArgument{
					"name": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"email": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"password": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					if userRepo == nil {
						return nil, errors.New("user repository tidak tersedia")
					}
					name := p.Args["name"].(string)
					email := p.Args["email"].(string)
					password := p.Args["password"].(string)

					if len(password) < 6 {
						return nil, errors.New("password minimal 6 karakter")
					}

					hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
					if err != nil {
						return nil, err
					}

					user := models.User{
						Name:       name,
						Email:      email,
						Password:   string(hashedPassword),
						Role:       "user",
						Avatar:     "https://api.dicebear.com/7.x/avataaars/svg?seed=" + name,
						IsVerified: true,
					}

					ctx := p.Context
					if ctx == nil {
						ctx = context.Background()
					}

					if err := userRepo.Create(ctx, &user); err != nil {
						return nil, err
					}

					token, err := utils.GenerateToken(&user, jwtSecret)
					if err != nil {
						return nil, err
					}

					return map[string]interface{}{
						"token": token,
						"user":  user,
					}, nil
				},
			},
			"login": &graphql.Field{
				Type:        AuthPayloadType,
				Description: "Login pengguna",
				Args: graphql.FieldConfigArgument{
					"email": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"password": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					if userRepo == nil {
						return nil, errors.New("user repository tidak tersedia")
					}
					email := p.Args["email"].(string)
					password := p.Args["password"].(string)

					ctx := p.Context
					if ctx == nil {
						ctx = context.Background()
					}

					user, err := userRepo.FindByEmail(ctx, email)
					if err != nil {
						return nil, errors.New("email atau password salah")
					}

					if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
						return nil, errors.New("email atau password salah")
					}

					token, err := utils.GenerateToken(user, jwtSecret)
					if err != nil {
						return nil, err
					}

					return map[string]interface{}{
						"token": token,
						"user":  *user,
					}, nil
				},
			},
		},
	})

	return graphql.NewSchema(graphql.SchemaConfig{
		Query:    rootQuery,
		Mutation: rootMutation,
	})
}

func getString(m map[string]interface{}, key string) string {
	if val, ok := m[key].(string); ok {
		return val
	}
	return ""
}

func getFloat(m map[string]interface{}, key string) float64 {
	if val, ok := m[key].(float64); ok {
		return val
	}
	if val, ok := m[key].(int); ok {
		return float64(val)
	}
	return 0
}
