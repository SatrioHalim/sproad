package main

import (
	"log"

	"github.com/SatrioHalim/Go-x-React-Journey/config"
	"github.com/SatrioHalim/Go-x-React-Journey/controllers"
	"github.com/SatrioHalim/Go-x-React-Journey/database/seed"
	"github.com/SatrioHalim/Go-x-React-Journey/repositories"
	"github.com/SatrioHalim/Go-x-React-Journey/routes"
	"github.com/SatrioHalim/Go-x-React-Journey/services"
	"github.com/SatrioHalim/Go-x-React-Journey/utils"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

func main() {
	config.LoadEnv()
	config.ConnectDB()
	log.Println("Current environment: ",config.AppConfig.Env)
	if config.AppConfig.Env == "production" {
		utils.RunMigration() // kalau pake docker	
	}

	seed.SeedAdmin()
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: config.AppConfig.CORSAllowOrigins,
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
	}))

	// User handling
	userRepo := repositories.NewUserRepository()
	userService := services.NewUserService(userRepo)
	userController := controllers.NewUserController(userService)

	// Board handling
	boardRepo := repositories.NewBoardRepository()
	boardMemberRepo := repositories.NewBoardMemberRepository()
	boardService := services.NewBoardService(boardRepo,userRepo,boardMemberRepo)
	boardController := controllers.NewBoardController(boardService)

	// List handling
	listPositionRepo := repositories.NewListPositionRepository()
	listRepo := repositories.NewListRepository()
	listService := services.NewListService(listRepo, boardRepo, listPositionRepo)

	// Card handling
	cardRepo := repositories.NewCardRepository()
	cardService := services.NewCardService(cardRepo, listRepo, userRepo)
	listController := controllers.NewListController(listService, cardService)
	cardController := controllers.NewCardController(cardService)

	routes.Setup(app, userController,boardController,listController,cardController)

	port := config.AppConfig.AppPort
	log.Println("Server is running on port :",port)
	log.Fatal(app.Listen(":"+port))

}
