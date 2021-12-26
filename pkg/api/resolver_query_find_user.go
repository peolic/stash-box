package api

import (
	"context"

	"github.com/gofrs/uuid"

	"github.com/stashapp/stash-box/pkg/models"
	"github.com/stashapp/stash-box/pkg/user"
)

func (r *queryResolver) FindUser(ctx context.Context, id *uuid.UUID, username *string) (*models.User, error) {
	fac := r.getRepoFactory(ctx)
	qb := fac.User()

	var ret *models.User
	var err error
	if id != nil {
		ret, err = qb.Find(*id)
	} else if username != nil {
		ret, err = qb.FindByName(*username)
	}

	return ret, err
}

func (r *queryResolver) QueryUsers(ctx context.Context, userFilter *models.UserFilterType, filter *models.QuerySpec) (*models.QueryUsersResultType, error) {
	fac := r.getRepoFactory(ctx)
	qb := fac.User()

	users, count, err := qb.Query(userFilter, filter)
	return &models.QueryUsersResultType{
		Users: users,
		Count: count,
	}, err
}

func (r *queryResolver) Me(ctx context.Context) (*models.User, error) {
	currentUser := getCurrentUser(ctx)
	if currentUser == nil {
		return nil, user.ErrUnauthorized
	}

	return currentUser, nil
}

func (r *queryResolver) CheckInviteKeys(ctx context.Context, input []uuid.UUID) ([]uuid.UUID, error) {
	fac := r.getRepoFactory(ctx)
	iqb := fac.Invite()
	aqb := fac.PendingActivation()

	var validKeys []uuid.UUID
	for _, inviteKey := range input {
		key, err := iqb.Find(inviteKey)
		if err != nil {
			return nil, err
		}

		// invalid invite key
		if key == nil {
			continue
		}

		// ensure key isn't already used
		a, err := aqb.FindByInviteKey(inviteKey.String(), models.PendingActivationTypeNewUser)
		if err != nil {
			return nil, err
		}

		// key already used
		if a != nil {
			continue
		}

		validKeys = append(validKeys, key.ID)
	}
	return validKeys, nil
}
