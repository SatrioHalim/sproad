package controllers

import (
	"github.com/SatrioHalim/Go-x-React-Journey/models"
	"github.com/SatrioHalim/Go-x-React-Journey/services"
	"github.com/SatrioHalim/Go-x-React-Journey/utils"
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

type ListController struct {
	service     services.ListService
	cardService services.CardService
}

func NewListController(s services.ListService, cs services.CardService) *ListController {
	return &ListController{service: s, cardService: cs}
}

func (c *ListController) CreateList(ctx fiber.Ctx) error{
	list := new(models.List)
	if err := ctx.Bind().Body(list); err != nil {
		return utils.BadRequest(ctx, "Failed to read request",err.Error())
	}
	if err := c.service.Create(list); err != nil {
		return utils.BadRequest(ctx, "Failed to create list",err.Error())
	}
	return utils.Success(ctx,"List created successfully",list)
}

func (c *ListController) UpdateList(ctx fiber.Ctx) error{
	publicID := ctx.Params("id")
	list := new(models.List)
	if err := ctx.Bind().Body(list); err != nil{
		return utils.BadRequest(ctx, "Failed to parse data",err.Error())
	}
	
	if _, err := uuid.Parse(publicID); err != nil {
		return utils.BadRequest(ctx, "Invalid ID",err.Error())
	}

	existingList, err := c.service.GetByPublicID(publicID)
	if err != nil {
		return utils.NotFound(ctx, "List not found", err.Error())
	}
	list.InternalID = existingList.InternalID
	list.PublicID = existingList.PublicID

	if err := c.service.Update(list); err != nil {
		return utils.BadRequest(ctx, "Failed to update list", err.Error())
	}

	updatedList, err := c.service.GetByPublicID(publicID)
	if err != nil {
		return utils.NotFound(ctx, "List not found", err.Error())
	}
	return utils.Success(ctx, "List updated successfully", updatedList)
}

func (c *ListController) GetListOnBoard(ctx fiber.Ctx) error{
	boardPublicID := ctx.Params("board_id")
	if _, err := uuid.Parse(boardPublicID); err != nil {
		return utils.BadRequest(ctx, "Invalid ID",err.Error())
	}

	lists, err := c.service.GetByBoardID(boardPublicID)
	if err != nil {
		return utils.NotFound(ctx, "Lists not found", err.Error())
	}
	return utils.Success(ctx, "Lists retrieved successfully", lists)
}

func (c *ListController) GetCardsOnList(ctx fiber.Ctx) error {
	listPublicID := ctx.Params("id")
	if _, err := uuid.Parse(listPublicID); err != nil {
		return utils.BadRequest(ctx, "Invalid ID", err.Error())
	}

	cards, err := c.cardService.GetByListID(listPublicID)
	if err != nil {
		return utils.NotFound(ctx, "Cards not found", err.Error())
	}

	return utils.Success(ctx, "Cards retrieved successfully", cards)
}

func (c *ListController) DeleteList(ctx fiber.Ctx) error {
	publicID := ctx.Params("id")
	if _, err := uuid.Parse(publicID); err != nil {
		return utils.BadRequest(ctx, "Invalid ID",err.Error())
	}

	list, err := c.service.GetByPublicID(publicID)
	if err != nil {
		return utils.NotFound(ctx, "List not found", err.Error())
	}

	if err := c.service.Delete(uint(list.InternalID)); err != nil {
		return utils.BadRequest(ctx, "Failed to delete list", err.Error())
	}

	return utils.Success(ctx, "List deleted successfully", publicID)
}

func (c *ListController) UpdateCardPosition(ctx fiber.Ctx) error {
	listPublicID := ctx.Params("id")
	if _, err := uuid.Parse(listPublicID); err != nil {
		return utils.BadRequest(ctx, "Invalid ID", err.Error())
	}

	var req struct {
		Positions []string `json:"positions"`
	}
	if err := ctx.Bind().Body(&req); err != nil {
		return utils.BadRequest(ctx, "Failed to parse positions", err.Error())
	}

	parsedPositions := make([]uuid.UUID, 0, len(req.Positions))
	for _, position := range req.Positions {
		parsed, err := uuid.Parse(position)
		if err != nil {
			return utils.BadRequest(ctx, "Invalid card position", err.Error())
		}
		parsedPositions = append(parsedPositions, parsed)
	}

	if err := c.cardService.UpdatePosition(listPublicID, parsedPositions); err != nil {
		return utils.BadRequest(ctx, "Failed to update card order", err.Error())
	}

	return utils.Success(ctx, "Card order updated successfully", req.Positions)
}
