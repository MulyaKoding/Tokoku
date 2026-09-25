package handler

import (
	"context"
	"net/http"
	"strings"

	"github.com/ecommerce-system/golang-api/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/graphql-go/graphql"
)

type GraphQLHandler struct {
	schema    graphql.Schema
	jwtSecret string
}

type GraphQLRequestBody struct {
	Query         string                 `json:"query"`
	OperationName string                 `json:"operationName"`
	Variables     map[string]interface{} `json:"variables"`
}

func NewGraphQLHandler(schema graphql.Schema, jwtSecret string) *GraphQLHandler {
	return &GraphQLHandler{
		schema:    schema,
		jwtSecret: jwtSecret,
	}
}

func (h *GraphQLHandler) RegisterRoutes(router *gin.Engine) {
	router.POST("/graphql", h.HandleQuery)
	router.GET("/graphql", h.HandlePlaygroundOrQuery)
}

func (h *GraphQLHandler) extractContext(c *gin.Context) context.Context {
	ctx := c.Request.Context()
	authHeader := c.GetHeader("Authorization")
	if authHeader != "" {
		parts := strings.Split(authHeader, " ")
		if len(parts) == 2 && strings.ToLower(parts[0]) == "bearer" {
			claims, err := utils.ValidateToken(parts[1], h.jwtSecret)
			if err == nil && claims != nil {
				ctx = context.WithValue(ctx, "user_id", claims.UserID)
				ctx = context.WithValue(ctx, "user_email", claims.Email)
				ctx = context.WithValue(ctx, "user_role", claims.Role)
			}
		}
	}
	return ctx
}

func (h *GraphQLHandler) HandleQuery(c *gin.Context) {
	var req GraphQLRequestBody
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": []gin.H{{"message": "Invalid request payload: " + err.Error()}},
		})
		return
	}

	ctx := h.extractContext(c)

	result := graphql.Do(graphql.Params{
		Schema:         h.schema,
		RequestString:  req.Query,
		VariableValues: req.Variables,
		OperationName:  req.OperationName,
		Context:        ctx,
	})

	c.JSON(http.StatusOK, result)
}

func (h *GraphQLHandler) HandlePlaygroundOrQuery(c *gin.Context) {
	query := c.Query("query")
	if query != "" {
		ctx := h.extractContext(c)
		result := graphql.Do(graphql.Params{
			Schema:        h.schema,
			RequestString: query,
			Context:       ctx,
		})
		c.JSON(http.StatusOK, result)
		return
	}

	// Tampilkan GraphiQL / GraphQL Playground IDE
	c.Header("Content-Type", "text/html; charset=utf-8")
	c.String(http.StatusOK, graphiQLHTML)
}

const graphiQLHTML = `
<!DOCTYPE html>
<html>
  <head>
    <title>Tokoku GraphQL Playground</title>
    <link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" />
  </head>
  <body style="margin: 0;">
    <div id="graphiql" style="height: 100vh;"></div>
    <script crossorigin src="https://unpkg.com/react/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/graphiql/graphiql.min.js"></script>
    <script>
      const fetcher = GraphiQL.createFetcher({ url: '/graphql' });
      ReactDOM.render(
        React.createElement(GraphiQL, {
          fetcher: fetcher,
          defaultEditorQuery: 'query {\n  products {\n    id\n    name\n    category\n    price\n    stock\n    rating\n  }\n}'
        }),
        document.getElementById('graphiql')
      );
    </script>
  </body>
</html>
`
