package utils

import (
	"log"
	"time"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func RunMigration() {
	var m *migrate.Migrate
	var err error

	for i := 0; i < 5; i++ {
		m, err = migrate.New(
			"file://database/migrations",
			"postgres://postgres:secret@db:5432/mydb?sslmode=disable",
		)

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