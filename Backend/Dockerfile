FROM golang:1.24-alpine AS build
ENV GOTOOLCHAIN=auto
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Sesuaikan path main package jika berbeda (mis. ./cmd/api)
RUN CGO_ENABLED=0 go build -o /server ./cmd/server

FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata
COPY --from=build /server /server
EXPOSE 8080
CMD ["/server"]
