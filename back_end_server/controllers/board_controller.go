package controllers

import (
	"fmt"
	"math"
	"strconv"

	"github.com/SatrioHalim/Go-x-React-Journey/models"
	"github.com/SatrioHalim/Go-x-React-Journey/services"
	"github.com/SatrioHalim/Go-x-React-Journey/utils"
	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
)

type BoardController struct {
	service     services.BoardService
	listService services.ListService
}

func NewBoardController(s services.BoardService, ls services.ListService) *BoardController{
	return &BoardController{service: s, listService: ls}
}

func (c *BoardController) CreateBoard(ctx fiber.Ctx) error{
	var userID uuid.UUID
	var err error
	board := new(models.Board)
	claims,ok := ctx.Locals("user").(jwt.MapClaims)
	
	// debug
	userVal := ctx.Locals("user")
	fmt.Printf("DEBUG: user type = %T, value = %v\n", userVal, userVal)
	
	if !ok {
		return utils.Unauthorized(ctx,"Unauthorized","Invalid or missing token claims")
	}

	if err := ctx.Bind().Body(board); err != nil {
		return utils.BadRequest(ctx,"Failed to read request",err.Error())
	}

	userID, err = uuid.Parse(claims["pub_id"].(string))
	if err != nil{
		return utils.BadRequest(ctx,"Failed to read request",err.Error())
	}
	board.OwnerPublicID = userID

	if err := c.service.Create(board); err != nil {
		return utils.BadRequest(ctx,"Failed to save data",err.Error())

	}
	return utils.Success(ctx,"Board created successfully",board)
}

func (c *BoardController) UpdateBoard(ctx fiber.Ctx) error{
	publicID := ctx.Params("id")
	board := new(models.Board)
	if err := ctx.Bind().Body(board); err != nil {
		return utils.BadRequest(ctx,"Failed to parsing data",err.Error())
	}

	if _, err := uuid.Parse(publicID); err != nil {
		return utils.BadRequest(ctx,"Invalid ID",err.Error())
	}
	existingBoard, err := c.service.GetByPublicID(publicID)
	if err != nil {
		return utils.NotFound(ctx,"Board not found",err.Error())
	}
	board.InternalID = existingBoard.InternalID
	board.PublicID = existingBoard.PublicID

	if err := c.service.Update(board); err != nil{
		return utils.BadRequest(ctx,"Failed to update board",err.Error())
	}
	return utils.Success(ctx,"Board updated successfully",board)
}

func (c *BoardController) UpdateListPosition(ctx fiber.Ctx) error {
	boardPublicID := ctx.Params("id")
	if _, err := uuid.Parse(boardPublicID); err != nil {
		return utils.BadRequest(ctx, "Invalid ID", err.Error())
	}

	var positions []string
	if err := ctx.Bind().Body(&positions); err != nil {
		return utils.BadRequest(ctx, "Failed to parse positions", err.Error())
	}

	parsedPositions := make([]uuid.UUID, 0, len(positions))
	for _, position := range positions {
		parsed, err := uuid.Parse(position)
		if err != nil {
			return utils.BadRequest(ctx, "Invalid list position", err.Error())
		}
		parsedPositions = append(parsedPositions, parsed)
	}

	if err := c.listService.UpdatePosition(boardPublicID, parsedPositions); err != nil {
		return utils.BadRequest(ctx, "Failed to update list order", err.Error())
	}

	return utils.Success(ctx, "List order updated successfully", positions)
}

func (c *BoardController) AddBoardMembers(ctx fiber.Ctx) error{
	publicID := ctx.Params("id")
	var userIDs []string

	if err := ctx.Bind().Body(&userIDs); err != nil {
		return utils.BadRequest(ctx,"Failed to parsing data",err.Error())
	}

	if err := c.service.AddMembers(publicID, userIDs); err != nil {
		return utils.BadRequest(ctx,"Failed to add members",err.Error())
	}
	
	return utils.Success(ctx,"Members added successfully",nil)
}
func (c *BoardController) RemoveBoardMembers(ctx fiber.Ctx) error{
	publicID := ctx.Params("id")
	var userIDs []string

	if err := ctx.Bind().Body(&userIDs); err != nil {
		return utils.BadRequest(ctx,"Failed to parsing data",err.Error())
	}

	if err := c.service.RemoveMembers(publicID, userIDs); err != nil {
		return utils.BadRequest(ctx,"Failed to remove members",err.Error())
	}
	
	return utils.Success(ctx,"Members removed successfully",nil)
}

func (c *BoardController) GetBoardMembers(ctx fiber.Ctx) error{
	publicID := ctx.Params("id")
	members, err := c.service.GetProjectMembers(publicID)
	if err != nil {
		return utils.NotFound(ctx,"Members not found",err.Error())
	}
	if len(members) == 0{
		return utils.Success(ctx, "Project member still empty",members)
	}
	var userResp []models.UserResponse
	_ = copier.Copy(&userResp,&members)
	return utils.Success(ctx,"Members found",userResp)
}

func (c *BoardController) GetMyBoardPaginate(ctx fiber.Ctx) error {
	claims, ok := ctx.Locals("user").(jwt.MapClaims)
	if !ok {
		return utils.Unauthorized(ctx, "Unauthorized", "Invalid or missing token claims")
	}
	userID, ok := claims["pub_id"].(string)
	if !ok {
		return utils.BadRequest(ctx, "Invalid token", "pub_id claim missing or invalid")
	}

	// parameter kedua ctx.query itu buat default value, kalau misal querynya gak ada, maka akan pakai default value tersebut
	page , _ := strconv.Atoi(ctx.Query("page","1"))
	limit, _ := strconv.Atoi(ctx.Query("limit","10"))
	offset := (page - 1) * limit
	filter := ctx.Query("filter","")
	sort := ctx.Query("sort","")

	boards, total, err := c.service.GetAllByUserPaginate(userID,filter,sort,limit,offset)
	if err != nil {
		return utils.InternalServerError(ctx,"Failed to fetch board data",err.Error())
	}
	meta := utils.PaginationMeta{
		Page: page,
		Limit: limit,
		Total: int(total),
		TotalPage: int(math.Ceil(float64(total) / float64(limit))),
		Sort: sort,
		Filter: filter,
	}

	if len(boards) == 0 {
		return utils.SuccessPagination(ctx,"No boards yet, Add your first board!",boards,meta)
	} 

	return utils.SuccessPagination(ctx, "Board Data fetch successfully", boards,meta)
	
}

func (c *BoardController) GetBoardByID(ctx fiber.Ctx) error{
	// id di param url, user yang ga punya akses ke board ga bisa dapet
	publicID := ctx.Params("id")
	boardDetail, err := c.service.GetByPublicID(publicID)
	if err != nil {
		return utils.NotFound(ctx,"Board not found",err.Error())
	}
	return utils.Success(ctx,"Board found",boardDetail)
}
