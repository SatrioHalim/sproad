package services

import (
	"errors"
	"fmt"

	"github.com/SatrioHalim/Go-x-React-Journey/config"
	"github.com/SatrioHalim/Go-x-React-Journey/models"
	"github.com/SatrioHalim/Go-x-React-Journey/models/types"
	"github.com/SatrioHalim/Go-x-React-Journey/repositories"
	"github.com/SatrioHalim/Go-x-React-Journey/utils"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ListService interface{
	GetByBoardID(boardPublicID string)(*ListWithOrder,error)
	GetByID(id uint)(*models.List,error)
	GetByPublicID(publicID string)(*models.List,error)
	Create(list *models.List) error
	Update(list *models.List) error
	Delete(id uint) error
	UpdatePosition(boardPublicID string, positions []uuid.UUID) error
}

type listService struct {
	listRepo repositories.ListRepository
	boardRepo repositories.BoardRepository
	listPositionRepo repositories.ListPositionRepository
}

type ListWithOrder struct{
	Position []uuid.UUID
	Lists []models.List
}


func NewListService(listRepo repositories.ListRepository, boardRepo repositories.BoardRepository, listPositionRepo repositories.ListPositionRepository) ListService {
	return &listService{listRepo, boardRepo, listPositionRepo}
}

func (s *listService) GetByBoardID(boardPublicID string)(*ListWithOrder,error){
	// verifikasi board
	_ , err := s.boardRepo.FindByPublicID(boardPublicID)
	if err != nil {
		return nil, errors.New("Board not found")
	}
	position,err := s.listPositionRepo.GetListOrder(boardPublicID)
	if err != nil {
		return nil, errors.New("Failed to get list order :" + err.Error())
	}
	if len(position) == 0{
		return nil,errors.New("List position not found")
	}

	lists, err := s.listRepo.FindByBoardID(boardPublicID)
	if err != nil{
		return nil, errors.New("Failed to get lists: " + err.Error())
	}

	// sorting by position
	orderedList := utils.SortListsByPosition(lists, position)

	return &ListWithOrder{
		Position: position,
		Lists: orderedList,
	}, nil
}

func (s *listService) GetByID(id uint)(*models.List,error){
	return s.listRepo.FindByID(id)
}

func (s *listService) GetByPublicID(publicID string)(*models.List,error){
	return s.listRepo.FindByPublicID(publicID)
}

func (s *listService) Create(list *models.List) error{
	// validasi board
	board, err := s.boardRepo.FindByPublicID(list.BoardPublicID.String())
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("Board not found")
		}
		return fmt.Errorf("Failed to get board: %w",err)
	}
	list.BoardInternalID = board.InternalID
	if list.PublicID == uuid.Nil{
		list.PublicID = uuid.New()
	}

	// transaction
	tx := config.DB.Begin()
	
	defer func(){ // defer untuk memastikan rollback jika terjadi panic
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Create(list).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("Failed to create list: %w", err)
	}

	// update list position
	var position models.ListPosition
	res := tx.Where("board_internal_id = ?", board.InternalID).First(&position)
	// jika belum ada posisi untuk board ini, buat baru dengan list order berisi list yang baru dibuat
	if errors.Is(res.Error, gorm.ErrRecordNotFound){
		// buat baru jika belum ada
		position = models.ListPosition{
			PublicID: uuid.New(),
			BoardID: board.InternalID,
			ListOrder: types.UUIDArray{list.PublicID},
		}
		if err := tx.Create(&position).Error; err != nil {
			tx.Rollback()
			return fmt.Errorf("Failed to create list position: %w", err)
		}
	} else if res.Error != nil { // jika error selain record not found
		tx.Rollback()
		return fmt.Errorf("Failed to create list position: %w", res.Error)
	} else { // jika sudah ada, update dengan menambahkan list baru ke posisi yang sudah ada
		// tambahkan id baru
		position.ListOrder = append(position.ListOrder, list.PublicID)
		// update ke DB
		if err := tx.Model(&position).Update("list_order",position.ListOrder).Error; err != nil {
			tx.Rollback()
			return fmt.Errorf("Failed to update list position: %w", err)
		}
	}

	// commit transaction
	if err := tx.Commit().Error; err != nil {
		return fmt.Errorf("Failed to commit transaction: %w", err)
	}
	return nil
}

func (s *listService) Update(list *models.List) error{
	return s.listRepo.Update(list)
}

func (s *listService) Delete(id uint) error{
	return s.listRepo.Delete(id)
}

func (s *listService) UpdatePosition(boardPublicID string, positions []uuid.UUID) error{
	// Verifikasi board
	board,err := s.boardRepo.FindByPublicID(boardPublicID)
	if err != nil {
		return errors.New("Board not found")
	}

	// Get List Position
	position,err := s.listPositionRepo.GetByBoard(board.PublicID.String())
	if err != nil {
		return errors.New("List position not found: " + err.Error())
	}

	// Update list ordernya
	position.ListOrder = positions
	return s.listPositionRepo.UpdateListOrder(position)
}