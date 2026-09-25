package middleware

import (
	"net/http"
	"strings"

	"github.com/ecommerce-system/golang-api/internal/response"
	"github.com/ecommerce-system/golang-api/internal/utils"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware memeriksa apakah request memiliki Authorization Bearer token yang valid
func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Error(c, http.StatusUnauthorized, "Header Authorization diperlukan", nil)
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			response.Error(c, http.StatusUnauthorized, "Format Authorization harus 'Bearer <token>'", nil)
			c.Abort()
			return
		}

		tokenString := parts[1]
		claims, err := utils.ValidateToken(tokenString, jwtSecret)
		if err != nil {
			response.Error(c, http.StatusUnauthorized, "Token tidak valid atau kadaluarsa", err)
			c.Abort()
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("user_email", claims.Email)
		c.Set("user_role", claims.Role)
		c.Next()
	}
}
