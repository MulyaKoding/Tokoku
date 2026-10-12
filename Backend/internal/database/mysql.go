package database

import (
	"context"
	"database/sql"
	"time"

	"github.com/go-sql-driver/mysql"
)

func ConnectMySQL(host, port, user, pass, name string, useSSL bool) (*sql.DB, error) {
	c := mysql.NewConfig()
	c.User = user
	c.Passwd = pass
	c.Net = "tcp"
	c.Addr = host + ":" + port
	c.DBName = name
	c.ParseTime = true
	if useSSL {
		c.TLSConfig = "true" // TiDB Cloud pakai CA publik, tidak perlu file CA
	}

	connector, err := mysql.NewConnector(c)
	if err != nil {
		return nil, err
	}
	db := sql.OpenDB(connector)
	db.SetMaxOpenConns(20)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(30 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		return nil, err
	}
	return db, nil
}