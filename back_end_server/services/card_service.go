package services

import (
	"errors"
	"fmt"
	"sort"
	"time"

	"github.com/SatrioHalim/Go-x-React-Journey/config"
	"github.com/SatrioHalim/Go-x-React-Journey/models"
	"github.com/SatrioHalim/Go-x-React-Journey/models/types"
	"github.com/SatrioHalim/Go-x-React-Journey/repositories"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CardService interface {
	Create(card *models.Card, listPublicID string) error
	Update(card *models.Card, listPublicID string) error
	Delete(id uint) error
	GetByListID(listPublicID string) ([]models.Card, error)
	GetByID(id uint) (*models.Card, error)
	GetByPublicID(publicID string) (*models.Card, error)
}

type cardService struct {
	cardRepo repositories.CardRepository
	listRepo repositories.ListRepository
	userRepo repositories.UserRepository
}

func NewCardService(cardRepo repositories.CardRepository, listRepo repositories.ListRepository, userRepo repositories.UserRepository) CardService {
	return &cardService{
		cardRepo, listRepo, userRepo,
	}
}

func (s *cardService) Create(card *models.Card, listPublicID string) error {
	// 1. Ambil list dari listPublicID
	list, err := s.listRepo.FindByPublicID(listPublicID)
	if err != nil {
		return fmt.Errorf("List not found: %w",err)
	}

	// 2. Set list internal ID ke card
	card.ListID = list.InternalID

	// 3. Generate public ID untuk card
	if card.PublicID == uuid.Nil{
		card.PublicID = uuid.New()
	}
	card.CreatedAt = time.Now()

	// 4. Mulai transaksi
	tx := config.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			panic(r)
		}
	}()

	// 5. Simpan card
	if err := tx.Create(card).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("Failed to create card: %w", err)
	}

	// 6. Update atau buat card_position
	var position models.CardPosition
	if err := tx.Model(&models.CardPosition{}).Where("list_internal_id = ?", list.InternalID).First(&position).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// buat baru jika belum ada
			position = models.CardPosition{
				PublicID: uuid.New(),
				ListID: list.InternalID,
				CardOrder: types.UUIDArray{card.PublicID},
			}

			if err := tx.Create(&position).Error; err != nil {
				tx.Rollback()
				return fmt.Errorf("Failed to create card position: %w", err)
			}
		} else {
			tx.Rollback()
			return fmt.Errorf("Failed to get card position: %w", err)
		}
	} else {
		// Tambahkan card baru ke urutan
		position.CardOrder = append(position.CardOrder, card.PublicID)
		if err := tx.Model(&models.CardPosition{}).Where("internal_id = ?",position.InternalID).Update("card_order",position.CardOrder).Error; err != nil {
			tx.Rollback()
			return fmt.Errorf("Failed to update card position: %w", err)
		}
	}

	// 7. Commit transaksi
	if err := tx.Commit().Error; err != nil {
		return fmt.Errorf("Failed to commit transaction: %w", err)
	}

	return  nil
}

func (s *cardService) Update(card *models.Card, listPublicID string) error {
	// amibl card lama
	exsistingCard, err := s.cardRepo.FindByPublicID(card.PublicID.String())
	if err != nil {
		return fmt.Errorf("Card not found: %w", err)
	}

	// ambil list baru
	newList, err := s.listRepo.FindByPublicID(listPublicID)
	if err != nil {
		return fmt.Errorf("List not found: %w", err)
	}

	// start transaction
	tx := config.DB.Begin()
	defer func() { // defer untuk memastikan rollback jika terjadi panic
		if r := recover(); r != nil {
			tx.Rollback()
			panic(r)
		}
	}()

	// jika pindah list -> hapus posisi list lama dan tambahkan ke list baru
	if exsistingCard.ListID != newList.InternalID {
		// hapus dari posisi list lama
		var oldPos models.CardPosition
		if err := tx.Where("list_internal_id = ?",exsistingCard.ListID).First(&oldPos).Error; err != nil {
			filtered := make(types.UUIDArray,0,len(oldPos.CardOrder))
			for _, id := range oldPos.CardOrder {
				if id != exsistingCard.PublicID {
					filtered = append(filtered, id)
				}
			}
			// update
			if err := tx.Model(&models.CardPosition{}).Where("internal_id = ?",oldPos.InternalID).Update("card_order",types.UUIDArray(filtered)).Error; err != nil {
				tx.Rollback()
				return fmt.Errorf("Failed to update old card position: %w", err)
			}
		} else if !errors.Is(err,gorm.ErrRecordNotFound){
			tx.Rollback()
			return fmt.Errorf("Failed to get old card position: %w", err)
		}

		// tambah ke list baru
		var newPos models.CardPosition
		res := tx.Where("list_internal_id = ?", newList.InternalID).First(&newPos)
		if errors.Is(res.Error, gorm.ErrRecordNotFound){
			newPos = models.CardPosition{
				PublicID: uuid.New(),
				ListID: newList.InternalID,
				CardOrder: types.UUIDArray{exsistingCard.PublicID},
			}
			if err := tx.Create(&newPos).Error; err != nil {
				tx.Rollback()
				return fmt.Errorf("Failed to create new card position: %w", err)
			}
		} else if res.Error == nil {
			updateOrder := append(newPos.CardOrder, exsistingCard.PublicID)
			if err := tx.Model(&models.CardPosition{}).Where("internal_id = ?",newPos.InternalID).Update("card_order",types.UUIDArray(updateOrder)).Error; err != nil {
				tx.Rollback()
				return fmt.Errorf("Failed to update new card position: %w", err)
			}
		} else {
			tx.Rollback()
			return fmt.Errorf("Failed to get new card position: %w", res.Error)
		}
	}

	// update card
	card.InternalID = exsistingCard.InternalID
	card.PublicID = exsistingCard.PublicID
	card.ListID = exsistingCard.ListID

	if err := tx.Save(card).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("Failed to update card: %w", err)
	}

	// commit transaction
	if err := tx.Commit().Error; err != nil {
		return fmt.Errorf("Failed to commit transaction: %w", err)
	}
	
	return nil
}

func (s *cardService) Delete(id uint) error {
	return s.cardRepo.Delete(id)
}

func (s *cardService) GetByListID(listPublicID string) ([]models.Card, error) {
	// Verifikasi List
	list,err := s.listRepo.FindByPublicID(listPublicID)
	if err != nil {
		return nil, fmt.Errorf("List not found: %w", err)
	}

	// ambil card position
	position, err := s.cardRepo.FindCardPositionByListID(list.InternalID)
	if err != nil {
		return nil, fmt.Errorf("Failed to get card position: %w", err)
	}

	// amibl semua card di list tersebut
	cards, err := s.cardRepo.FindByListID(listPublicID)
	if err != nil {
		return nil, fmt.Errorf("Failed to get cards : %w", err)
	}

	// sorting
	if position != nil && len(position.CardOrder) > 0 {
		cards = sortCardByPositions(cards, position.CardOrder)
	}

	return cards, nil
}

func sortCardByPositions(cards []models.Card, order []uuid.UUID) []models.Card{
	// buat map untuk akses cepat
	orderMap := make(map[uuid.UUID]int)
	for i, id := range order {
		orderMap[id] = i
	}

	defaultIndex := len(order) // untuk card yang tidak ada di order, letakkan di akhir

	// sorting slice
	sort.SliceStable(cards, func(i, j int) bool {
		idxI, okI := orderMap[cards[i].PublicID]
		if !okI {
			idxI = defaultIndex
		}
		idxJ, okJ := orderMap[cards[j].PublicID]
		if !okJ {
			idxJ = defaultIndex
		}
		if idxI == idxJ {
			return cards[i].CreatedAt.Before(cards[j].CreatedAt) // jika posisi sama, urutkan berdasarkan created_at
		}
		return idxI < idxJ
	})

	return cards
}

func (s *cardService) GetByID(id uint) (*models.Card, error) {
	return s.cardRepo.FindByID(id)
}

func (s *cardService) GetByPublicID(publicID string) (*models.Card, error) {
	return s.cardRepo.FindByPublicID(publicID)
}