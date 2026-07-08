package controllers

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/SatrioHalim/Go-x-React-Journey/models"
	"github.com/SatrioHalim/Go-x-React-Journey/services"
	"github.com/SatrioHalim/Go-x-React-Journey/utils"
	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type CardController struct {
	service services.CardService
}

func NewCardController(service services.CardService) *CardController {
	return &CardController{service}
}

func (c *CardController) CreateCard(ctx fiber.Ctx) error {
	type CreateCardRequest struct {
		ListPublicID string    `json:"list_id"`
		Title        string    `json:"title"`
		Description  string    `json:"description"`
		DueDate      time.Time `json:"due_date"`
		Position     int       `json:"position"`
	}

	var req CreateCardRequest
	if err := ctx.Bind().Body(&req); err != nil {
		return utils.BadRequest(ctx, "Failed to fetch data", err.Error())
	}
	card := &models.Card{
		Title:       req.Title,
		Description: req.Description,
		DueDate:     &req.DueDate,
		Position:    req.Position,
	}
	if err := c.service.Create(card, req.ListPublicID); err != nil {
		return utils.InternalServerError(ctx, "Failed to create card", err.Error())
	}
	return utils.Success(ctx, "Card created successfully", card)
}

func (c *CardController) UpdateCard(ctx fiber.Ctx) error {
	publicID := ctx.Params("id")

	type updateCardRequest struct {
		ListPublicID string     `json:"list_id"`
		Title        string     `json:"title"`
		Description  string     `json:"description"`
		DueDate      *time.Time `json:"due_date"`
		Position     int        `json:"position"`
	}

	var req updateCardRequest
	if err := ctx.Bind().Body(&req); err != nil {
		return utils.BadRequest(ctx, "Failed to parsing data", err.Error())
	}

	if _, err := uuid.Parse(publicID); err != nil {
		return utils.BadRequest(ctx, "Invalid id", err.Error())
	}

	card := &models.Card{
		Title:       req.Title,
		Description: req.Description,
		DueDate:     req.DueDate,
		Position:    req.Position,
		PublicID:    uuid.MustParse(publicID),
	}

	if err := c.service.Update(card, req.ListPublicID); err != nil {
		return utils.InternalServerError(ctx, "Failed to update data", err.Error())
	}

	return utils.Success(ctx, "Card updated successfully", card)
}

func (c *CardController) DeleteCard(ctx fiber.Ctx) error {
	publicID := ctx.Params("id")

	if _, err := uuid.Parse(publicID); err != nil {
		return utils.BadRequest(ctx, "Invalid ID", err.Error())
	}

	card, err := c.service.GetByPublicID(publicID)
	if err != nil {
		return utils.NotFound(ctx, "Card not found", err.Error())
	}

	if err := c.service.Delete(uint(card.InternalID)); err != nil {
		return utils.BadRequest(ctx, "Failed to delete card", err.Error())
	}

	return utils.Success(ctx, "Card deleted successfully", publicID)
}

func (c *CardController) GetCardDetail(ctx fiber.Ctx) error {
	cardPublicID := ctx.Params("id")

	card, err := c.service.GetByPublicID(cardPublicID)
	if err != nil {
		return utils.InternalServerError(ctx, "Error while retrieving data", err.Error())
	}
	if card == nil {
		return utils.NotFound(ctx, "Card not found", err.Error())
	}
	return utils.Success(ctx, "Data fetch successfully", card)
}

func getUserPublicIDFromClaims(ctx fiber.Ctx) (string, error) {
	claims, ok := ctx.Locals("user").(jwt.MapClaims)
	if !ok {
		return "", fmt.Errorf("invalid or missing token claims")
	}

	userPublicID, ok := claims["pub_id"].(string)
	if !ok || strings.TrimSpace(userPublicID) == "" {
		return "", fmt.Errorf("pub_id claim missing or invalid")
	}

	return userPublicID, nil
}

func (c *CardController) AddCardAssignees(ctx fiber.Ctx) error {
	cardPublicID := ctx.Params("id")

	var req struct {
		UserIDs []string `json:"user_id"`
	}
	if err := ctx.Bind().Body(&req); err != nil {
		return utils.BadRequest(ctx, "Failed to parse assignee data", err.Error())
	}

	if len(req.UserIDs) == 0 {
		return utils.BadRequest(ctx, "No assignee selected", "")
	}

	if err := c.service.AddAssignees(cardPublicID, req.UserIDs); err != nil {
		return utils.BadRequest(ctx, "Failed to add assignees", err.Error())
	}

	card, err := c.service.GetByPublicID(cardPublicID)
	if err != nil {
		return utils.InternalServerError(ctx, "Failed to refresh card data", err.Error())
	}

	return utils.Success(ctx, "Assignees added successfully", card)
}

func (c *CardController) AddCardAttachments(ctx fiber.Ctx) error {
	cardPublicID := ctx.Params("id")
	userPublicID, err := getUserPublicIDFromClaims(ctx)
	if err != nil {
		return utils.Unauthorized(ctx, "Unauthorized", err.Error())
	}

	form, err := ctx.MultipartForm()
	if err != nil {
		return utils.BadRequest(ctx, "Failed to read attachment data", err.Error())
	}

	files := form.File["files"]
	if len(files) == 0 {
		files = form.File["file"]
	}
	if len(files) == 0 {
		return utils.BadRequest(ctx, "No attachment selected", "")
	}

	if err := os.MkdirAll("files", 0755); err != nil {
		return utils.InternalServerError(ctx, "Failed to prepare file storage", err.Error())
	}

	storedFiles := make([]string, 0, len(files))
	for _, fileHeader := range files {
		storedName := fmt.Sprintf("%s_%s", uuid.NewString(), filepath.Base(fileHeader.Filename))
		storedPath := filepath.Join("files", storedName)

		if err := ctx.SaveFile(fileHeader, storedPath); err != nil {
			// cleanup partial uploads
			for _, saved := range storedFiles {
				_ = os.Remove(saved)
			}
			return utils.InternalServerError(ctx, "Failed to save attachment file", err.Error())
		}

		storedFiles = append(storedFiles, storedPath)
	}

	if err := c.service.AddAttachments(cardPublicID, userPublicID, storedFiles); err != nil {
		for _, saved := range storedFiles {
			_ = os.Remove(saved)
		}
		return utils.BadRequest(ctx, "Failed to store attachment metadata", err.Error())
	}

	card, err := c.service.GetByPublicID(cardPublicID)
	if err != nil {
		return utils.InternalServerError(ctx, "Failed to refresh card data", err.Error())
	}

	return utils.Success(ctx, "Attachments uploaded successfully", card)
}

func (c *CardController) DeleteCardAttachment(ctx fiber.Ctx) error {
	cardPublicID := ctx.Params("id")
	attachmentPublicID := ctx.Params("attachment_id")

	if err := c.service.DeleteAttachment(cardPublicID, attachmentPublicID); err != nil {
		return utils.BadRequest(ctx, "Failed to delete attachment", err.Error())
	}

	card, err := c.service.GetByPublicID(cardPublicID)
	if err != nil {
		return utils.InternalServerError(ctx, "Failed to refresh card data", err.Error())
	}

	return utils.Success(ctx, "Attachment deleted successfully", card)
}