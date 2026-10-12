package handler

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/ecommerce-system/golang-api/internal/config"
	"github.com/gin-gonic/gin"
)

func TestStatusHandler_HTML(t *testing.T) {
	gin.SetMode(gin.TestMode)

	cfg := &config.Config{
		AppName:    "API Tokoku",
		AppEnv:     "production",
		AppVersion: "1.0.0",
	}

	h := NewStatusHandler(cfg)
	router := gin.New()
	h.RegisterRoutes(router)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	body := w.Body.String()
	if !strings.Contains(body, "API Tokoku") {
		t.Errorf("expected body to contain 'API Tokoku'")
	}
	if !strings.Contains(body, "SERVER TIME") {
		t.Errorf("expected body to contain 'SERVER TIME'")
	}
}

func TestStatusHandler_JSON(t *testing.T) {
	gin.SetMode(gin.TestMode)

	cfg := &config.Config{
		AppName:    "API Tokoku",
		AppEnv:     "production",
		AppVersion: "1.0.0",
	}

	h := NewStatusHandler(cfg)
	router := gin.New()
	h.RegisterRoutes(router)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/server-info", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	body := w.Body.String()
	if !strings.Contains(body, `"serverTime"`) {
		t.Errorf("expected json to contain serverTime, got %s", body)
	}
	if !strings.Contains(body, `"nodeEnv"`) {
		t.Errorf("expected json to contain nodeEnv, got %s", body)
	}
}
