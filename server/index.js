"use strict";
exports.__esModule = true;
var graphql_yoga_1 = require("graphql-yoga");
var node_http_1 = require("node:http");
var graphql_import_1 = require("graphql-import");
var schema_1 = require("@graphql-tools/schema");
var typeDefs = (0, graphql_import_1.importSchema)("./schema.gql");
var games = [];
var users = [];
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
        },
        getUsers: function () { return users; }
    },
    Mutation: {
        createGame: function (_, _a, _b) {
            var fen = _a.fen, gameId = _a.gameId, receiverID = _a.receiverID, requesterID = _a.requesterID, requesterColor = _a.requesterColor;
            var pubSub = _b.pubSub;
            var game = {
                id: gameId,
                receiverID: receiverID,
                requesterID: requesterID,
                requesterColor: requesterColor,
                fen: fen,
                turn: "white",
                moves: [],
                users: [],
                started: false
            };
            //here I want to make sure both users exist and are online
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
        },
        addUser: function (_, _a, _b) {
            var id = _a.id, username = _a.username, cat_url = _a.cat_url;
            var pubSub = _b.pubSub;
            var notification = [];
            var user = {
                id: id,
                username: username,
                last_seen: Date.now().toString(),
                cat_url: cat_url,
                notification: notification
            };
            if (users.find(function (user) { return user.id === id; })) {
                return user;
            }
            users.push(user);
            pubSub.publish("users", users);
            removeOldUsers();
            return user;
        },
        deleteUser: function (_, _a, _b) {
            var id = _a.id;
            var pubSub = _b.pubSub;
            var userIndex = users.findIndex(function (user) { return user.id === id; });
            if (userIndex !== -1) {
                var user = users[userIndex];
                users.splice(userIndex, 1);
                pubSub.publish("users", users);
                return user;
            }
            return false;
        },
        updateLastSeen: function (_, _a, _b) {
            var id = _a.id;
            var pubSub = _b.pubSub;
            var user = users.find(function (user) { return user.id === id; });
            if (user) {
                // console.log("updating last seen")
                user.last_seen = Date.now().toString();
                pubSub.publish("users", users);
                return user;
            }
            return false;
        },
        sendNotification: function (_, _a, _b) {
            var gameId = _a.gameId, requesterID = _a.requesterID, requesterColor = _a.requesterColor, receiverID = _a.receiverID;
            var pubSub = _b.pubSub;
            var receiver = users.find(function (user) { return user.id === receiverID; });
            if (receiver) {
                var notification = {
                    gameId: gameId,
                    requesterID: requesterID,
                    requesterColor: requesterColor,
                    receiverID: receiverID
                };
                receiver.notification.push(notification);
                pubSub.publish("notification", notification);
                return receiver;
            }
            return false;
        },
        startGame: function (_, _a, _b) {
            var gameId = _a.gameId;
            var pubSub = _b.pubSub;
            var game = games.find(function (game) { return game.id === gameId; });
            if (game) {
                game.started = true;
                pubSub.publish("game", game.id, game);
                return game;
            }
            return false;
        },
        move: function (_, _a, _b) {
            var from = _a.from, to = _a.to, endFen = _a.endFen, gameId = _a.gameId;
            var pubSub = _b.pubSub;
            var game = games.find(function (game) { return game.id === gameId; });
            if (game) {
                game.fen = endFen;
                game.moves.push({ from: from, to: to, endFen: endFen });
                pubSub.publish("game", game.id, game);
                return game;
            }
            return false;
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
        },
        users: {
            subscribe: function (_, _a, _b) {
                var pubSub = _b.pubSub;
                var iterator = pubSub.subscribe("users");
                return iterator;
            },
            resolve: function (payload) { return payload; }
        },
        //must modify to make user specific
        notifications: {
            subscribe: function (_, _a, _b) {
                var pubSub = _b.pubSub;
                //onyl send notifications to the user if Id matches
                var iterator = pubSub.subscribe("notification");
                return iterator;
            },
            resolve: function (payload) { return payload; }
        }
    }
};
function checkUsers() {
    users.forEach(function (user) {
        if (parseInt(user.last_seen) < Date.now() - 10000) {
            deleteUser(user.id);
        }
    });
}
function deleteUser(id) {
    var userIndex = users.findIndex(function (user) { return user.id === id; });
    if (userIndex !== -1) {
        var user = users[userIndex];
        users.splice(userIndex, 1);
        pubSub.publish("users", users);
        return user;
    }
    return false;
}
var clearOldUsers;
function removeOldUsers() {
    clearOldUsers = setInterval(checkUsers, 10000);
}
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
    console.log("Server is running on http://localhost:4000/graphql");
});
