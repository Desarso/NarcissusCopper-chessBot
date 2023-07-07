package graph

import "github.com/desarso/goGraphql/graph/model"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	chessUsers []*model.ChessUser
	chessGames []*model.ChessGame

	//make the channels here
	chessGamesChannel    chan *model.ChessGame
	chessUsersChannel    chan []*model.ChessUser
	chessRequestsChannel chan *model.ChessRequest
}
