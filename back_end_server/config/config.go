package config

import (
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB *gorm.DB
	AppConfig *Config
)

type Config struct {
	AppPort string
	DBHost string
	DBPort string
	DBUser string
	DBPassword string
	DBName string
	JWTSecret string
	JWTExpireMinutes string
	JWTRefreshToken string
	JWTExpire string
	AppURL string
	CORSAllowOrigins []string
	Env string
}

func LoadEnv(){
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found.")
	}
	AppConfig = &Config{
		AppPort: getEnv("PORT","3030"),
		DBHost: getEnv("DB_HOST", "localhost"),
		DBPort: getEnv("DB_PORT", "5432"),
		DBUser: getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD","password"),
		DBName: getEnv("DB_NAME","project_management"),
		JWTSecret: getEnv("JWT_SECRET","rahasia"),
		JWTRefreshToken: getEnv("REFRESH_TOKEN_EXPIRED","24h"),
		JWTExpire: getEnv("JWT_EXPIRED","6h"),
		AppURL: getEnv("APP_URL","http://localhost:3030"),
		CORSAllowOrigins: getEnvAsSlice("CORS_ALLOW_ORIGINS", []string{
			"http://localhost:5173",
			"http://127.0.0.1:5173",
		}),
		Env: getEnv("ENV","development"),
	}
}

func getEnv(key string, fallback string) string {
	value,exist := os.LookupEnv(key)
	if exist {
		return value
	} else {
		return fallback
	}
}

func getEnvAsSlice(key string, fallback []string) []string {
	value, exist := os.LookupEnv(key)
	if !exist || strings.TrimSpace(value) == "" {
		return fallback
	}

	parts := strings.Split(value, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}

	if len(result) == 0 {
		return fallback
	}

	return result
}

func ConnectDB(){
	cfg := AppConfig

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname= %s sslmode=disable", cfg.DBHost, cfg.DBPort,cfg.DBUser,cfg.DBPassword,cfg.DBName)

	// Open connection
	db,err := gorm.Open(postgres.Open(dsn),&gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database",err)
	}

	// get db instance
	sqlDB,err := db.DB()
	if err != nil {
		log.Fatal("Failed to get database instance",err)
	}

	// pulling connection
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	DB = db
}
