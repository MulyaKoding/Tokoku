package constants

import "time"

const (
	// Collection Names
	CollectionProducts = "products"

	// Timeouts
	DefaultQueryTimeout = 5 * time.Second
	DefaultConnTimeout  = 10 * time.Second

	// API Routes
	ApiV1Group = "/api/v1"

	// Environment Defaults
	DefaultAppEnv  = "development"
	DefaultAppPort = "8080"
)

