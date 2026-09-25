package graphql_test

import (
	"context"
	"errors"
	"testing"

	"github.com/ecommerce-system/golang-api/internal/graphql"
	"github.com/ecommerce-system/golang-api/internal/models"
	gql "github.com/graphql-go/graphql"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type mockProductRepo struct {
	products []models.Product
}

func (m *mockProductRepo) FindAll(ctx context.Context) ([]models.Product, error) {
	return m.products, nil
}

func (m *mockProductRepo) FindByID(ctx context.Context, id string) (*models.Product, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("invalid id")
	}
	for _, p := range m.products {
		if p.ID == objID {
			return &p, nil
		}
	}
	return nil, errors.New("product not found")
}

func (m *mockProductRepo) Create(ctx context.Context, product *models.Product) error {
	product.ID = primitive.NewObjectID()
	m.products = append(m.products, *product)
	return nil
}

func (m *mockProductRepo) Update(ctx context.Context, id string, product *models.Product) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("invalid id")
	}
	for i, p := range m.products {
		if p.ID == objID {
			m.products[i] = *product
			return nil
		}
	}
	return errors.New("product not found")
}

func (m *mockProductRepo) Delete(ctx context.Context, id string) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("invalid id")
	}
	for i, p := range m.products {
		if p.ID == objID {
			m.products = append(m.products[:i], m.products[i+1:]...)
			return nil
		}
	}
	return errors.New("product not found")
}

type mockUserRepo struct {
	users []models.User
}

func (m *mockUserRepo) Create(ctx context.Context, user *models.User) error {
	user.ID = primitive.NewObjectID()
	m.users = append(m.users, *user)
	return nil
}

func (m *mockUserRepo) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	for _, u := range m.users {
		if u.Email == email {
			return &u, nil
		}
	}
	return nil, errors.New("user not found")
}

func (m *mockUserRepo) FindByID(ctx context.Context, id string) (*models.User, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("invalid id")
	}
	for _, u := range m.users {
		if u.ID == objID {
			return &u, nil
		}
	}
	return nil, errors.New("user not found")
}

func (m *mockUserRepo) Update(ctx context.Context, id string, user *models.User) error {
	return nil
}

type mockVerificationRepo struct {
	codes []models.VerificationCode
}

func (m *mockVerificationRepo) SaveCode(ctx context.Context, v *models.VerificationCode) error {
	m.codes = append(m.codes, *v)
	return nil
}

func (m *mockVerificationRepo) FindByEmailAndCode(ctx context.Context, email, code string) (*models.VerificationCode, error) {
	for _, c := range m.codes {
		if c.Email == email && c.Code == code {
			return &c, nil
		}
	}
	return nil, errors.New("not found")
}

func (m *mockVerificationRepo) FindByEmail(ctx context.Context, email string) (*models.VerificationCode, error) {
	for _, c := range m.codes {
		if c.Email == email {
			return &c, nil
		}
	}
	return nil, errors.New("not found")
}

func (m *mockVerificationRepo) DeleteByEmail(ctx context.Context, email string) error {
	return nil
}

type mockEmailService struct{}

func (m *mockEmailService) GenerateOTP() string {
	return "123456"
}

func (m *mockEmailService) SendVerificationEmail(toEmail, toName, otpCode string) error {
	return nil
}

func TestGraphQLSchema(t *testing.T) {
	testID := primitive.NewObjectID()
	productRepo := &mockProductRepo{
		products: []models.Product{
			{
				ID:          testID,
				Name:        "Test Keyboard",
				Category:    "Aksesori",
				Price:       500000,
				Image:       "http://example.com/img.png",
				Description: "Mechanical keyboard",
				Stock:       10,
				Rating:      4.8,
			},
		},
	}
	userRepo := &mockUserRepo{}
	verificationRepo := &mockVerificationRepo{}
	emailService := &mockEmailService{}

	schema, err := graphql.NewSchema(productRepo, userRepo, verificationRepo, emailService, "test_secret")
	if err != nil {
		t.Fatalf("Failed to create GraphQL schema: %v", err)
	}

	t.Run("Query Products", func(t *testing.T) {
		query := `{
			products {
				id
				name
				category
				price
				stock
			}
		}`

		params := gql.Params{
			Schema:        schema,
			RequestString: query,
		}
		result := gql.Do(params)
		if len(result.Errors) > 0 {
			t.Fatalf("Query failed with errors: %v", result.Errors)
		}

		data, ok := result.Data.(map[string]interface{})
		if !ok {
			t.Fatalf("Invalid response structure")
		}
		products, ok := data["products"].([]interface{})
		if !ok || len(products) != 1 {
			t.Fatalf("Expected 1 product, got %v", products)
		}
	})

	t.Run("Mutation Register User", func(t *testing.T) {
		mutation := `mutation {
			register(
				name: "Budi Santoso"
				email: "budi@example.com"
				password: "password123"
			) {
				token
				user {
					name
					email
					role
				}
			}
		}`

		params := gql.Params{
			Schema:        schema,
			RequestString: mutation,
		}
		result := gql.Do(params)
		if len(result.Errors) > 0 {
			t.Fatalf("Mutation register failed: %v", result.Errors)
		}

		data := result.Data.(map[string]interface{})
		reg := data["register"].(map[string]interface{})
		if reg["token"] == "" {
			t.Errorf("Expected token to be returned")
		}
		u := reg["user"].(map[string]interface{})
		if u["name"] != "Budi Santoso" {
			t.Errorf("Expected user name 'Budi Santoso', got '%v'", u["name"])
		}
	})
}
