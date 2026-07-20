package utils

import (
	"fmt"
	"log"
	"time"

	"github.com/SatrioHalim/Go-x-React-Journey/config"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func RunMigration() {
	cfg := config.AppConfig

	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName, cfg.DBSSLMode)

	var m *migrate.Migrate
	var err error

	for i := 0; i < 5; i++ {
		m, err = migrate.New("file://database/migrations", dsn)

		if err == nil {
			err = m.Up()
			if err == nil || err.Error() == "no change" {
				log.Println("Migration success")
				return
			}
		}

		log.Println("Migration retrying...", err)
		time.Sleep(2 * time.Second)
	}

	log.Fatal("Migration failed after retries:", err)
}