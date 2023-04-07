"use strict";
exports.__esModule = true;
var graphql_yoga_1 = require("graphql-yoga");
var node_http_1 = require("node:http");
var graphql_import_1 = require("graphql-import");
var schema_1 = require("@graphql-tools/schema");
var typeDefs = (0, graphql_import_1.importSchema)("./schema.gql");
var games = [];
var pubSub = (0, graphql_yoga_1.createPubSub)();
//let's think about this
//we want the chessBoard, to keep the game state updated online in real time
//so we want to keep a datatype call game, which should have all of the game data kept
//in the object, so that would be fen string, castling rights, etc. this will all be in the
//fen string so that might be enough
//we should use a redis database to keep the game
console.log(typeDefs);
var resolvers = {
    Query: {
        getGames: function () { return games; },
        getGame: function (_, _a) {
            var id = _a.id;
            var game = games.find(function (game) { return game.id === id; });
            if (game) {
                return game;
            }
            return null;
        }
    },
    Mutation: {
        createGame: function (_, _a, _b) {
            var fen = _a.fen, blackBoardId = _a.blackBoardId, whiteBoardId = _a.whiteBoardId;
            var pubSub = _b.pubSub;
            var game = {
                id: "".concat(games.length + 1),
                blackBoardId: blackBoardId,
                whiteBoardId: whiteBoardId,
                fen: fen,
                turn: "white"
            };
            pubSub.publish('game', game.id, game);
            games.push(game);
            return game;
        },
        changeFen: function (_, _a, _b) {
            var id = _a.id, fen = _a.fen;
            var pubSub = _b.pubSub;
            var game = games.find(function (game) { return game.id === id; });
            if (game) {
                game.fen = fen;
                pubSub.publish('game', game.id, game);
                return game;
            }
            return null;
        },
        changeTurn: function (_, _a, _b) {
            var id = _a.id, turn = _a.turn;
            var pubSub = _b.pubSub;
            var game = games.find(function (game) { return game.id === id; });
            if (game) {
                game.turn = turn;
                pubSub.publish('game', game.id, game);
                return game;
            }
            return null;
        }
    },
    Subscription: {
        game: {
            subscribe: function (_, _a, _b) {
                var id = _a.id;
                var pubSub = _b.pubSub;
                var game = games.find(function (game) { return game.id === id; });
                var iterator = pubSub.subscribe("game", id);
                return iterator;
            },
            resolve: function (payload) { return payload; }
        }
    }
};
var schema = (0, schema_1.makeExecutableSchema)({
    typeDefs: [typeDefs],
    resolvers: [resolvers]
});
var yoga = (0, graphql_yoga_1.createYoga)({
    schema: schema,
    context: {
        pubSub: pubSub
    }
});
var server = (0, node_http_1.createServer)(yoga);
server.listen(4000, function () {
    console.log("Server is running on localhost:4000");
});
