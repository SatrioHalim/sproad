package services

import (
	"errors"

	"github.com/SatrioHalim/Go-x-React-Journey/models"
	"github.com/SatrioHalim/Go-x-React-Journey/repositories"
	"github.com/google/uuid"
)

type BoardService interface {
	Create(board *models.Board) error
	Update(board *models.Board) error
	GetByPublicID(publicID string) (*models.Board, error)
	GetProjectMembers(boardPublicID string) ([]models.User, error)
	AddMembers(boardPublicID string, userPublicIDs []string) error
	RemoveMembers(boardPublicID string, userPublicIDs []string) error
	GetAllByUserPaginate(userID, filter, sort string, limit,offset int)([]models.Board,int64, error)
}

type boardService struct {
	boardRepo repositories.BoardRepository
	userRepo repositories.UserRepository
	boardMemberRepo repositories.BoardMemberRepository
}

func NewBoardService(boardRepo repositories.BoardRepository, userRepo repositories.UserRepository, boardMemberRepo repositories.BoardMemberRepository) BoardService {
	return &boardService{boardRepo, userRepo, boardMemberRepo}
}

func (s *boardService) Create(board *models.Board) error{
	user, err := s.userRepo.FindByPublicID(board.OwnerPublicID.String())
	if err != nil {
		return errors.New("Owner not found")
	}
	board.PublicID = uuid.New()
	board.OwnerID = user.InternalID
	return s.boardRepo.Create(board)
}

func (s *boardService) Update(board *models.Board) error{
	return s.boardRepo.Update(board)
}

func (s *boardService) GetByPublicID(publicID string) (*models.Board, error) {
	return s.boardRepo.FindByPublicID(publicID)
}

func (s *boardService) GetProjectMembers(boardPublicID string) ([]models.User, error){
	board, err := s.boardRepo.FindByPublicID(boardPublicID)
	if err != nil {
		return nil, errors.New("Board not found")
	}
	members, err := s.boardMemberRepo.GetMembers(string(board.PublicID.String()))
	if err != nil {
		return nil, err
	}
	return members, nil
}

func (s *boardService) AddMembers(boardPublicID string, userPublicIDs []string) error {
	board, err := s.boardRepo.FindByPublicID(boardPublicID)
	if err != nil {
		return errors.New("Board not found")
	}

	var userInternalIDs []uint
	for _, userPublicID := range userPublicIDs{
		user, err := s.userRepo.FindByPublicID(userPublicID)
		if err != nil {
			return errors.New("User not found: " + userPublicID)
		}
		userInternalIDs = append(userInternalIDs, uint(user.InternalID))
	}
	// Cek keanggotaan user di board
	existingMembers, err := s.boardMemberRepo.GetMembers(string(board.PublicID.String()))
	if err != nil {
		return err
	}
	// cek cepat via map
	memberMap := make(map[uint]bool)
	for _, member := range existingMembers {
		memberMap[uint(member.InternalID)] = true
	}

	var newMembersIDs []uint
	for _, userID := range userInternalIDs {
		// hanya tambahkan jika belum menjadi anggota
		if !memberMap[userID] {
			newMembersIDs = append(newMembersIDs, userID)
		}
	}
	if len(newMembersIDs) == 0{
		return nil // tidak ada anggota baru untuk ditambahkan
	}
	return s.boardRepo.AddMember(uint(board.InternalID), newMembersIDs)
}

func (s *boardService) RemoveMembers(boardPublicID string, userPublicIDs []string) error {
	board, err := s.boardRepo.FindByPublicID(boardPublicID)
	if err != nil {
		return errors.New("Board not found")
	}

	// Validasi user
	var userInternalIDs []uint
	for _, userPublicID := range userPublicIDs {
		user, err := s.userRepo.FindByPublicID(userPublicID)
		if err != nil {
			return errors.New("User not found: " + userPublicID)
		}
		userInternalIDs = append(userInternalIDs, uint(user.InternalID))
	}

	// cek keanggotaan
	existingMembers, err := s.boardMemberRepo.GetMembers(string(board.PublicID.String()))
	if err != nil {
		return err
	}

	// cek cepat via map
	memberMap := make(map[uint]bool)
	for _, member := range existingMembers {
		memberMap[uint(member.InternalID)] = true
	}

	var memberToRemove []uint
	for _, userID := range userInternalIDs {
		if memberMap[userID] {
			memberToRemove = append(memberToRemove, userID)
		}
	}
	return s.boardRepo.RemoveMember(uint(board.InternalID),memberToRemove)
}

func (s *boardService) GetAllByUserPaginate(userID, filter, sort string, limit,offset int)([]models.Board,int64, error){
	return s.boardRepo.FindAllByUserPaginate(userID,filter,sort,limit,offset)
}