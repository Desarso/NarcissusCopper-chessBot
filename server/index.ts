import { createYoga, createPubSub} from "graphql-yoga";
import { createServer } from "node:http";
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from '@graphql-tools/schema';
import {game, User, Move, Notification} from "./gameStructs";



const typeDefs = importSchema("./schema.gql");






const games: game[] = [];
const users: User[] = [];


const pubSub = createPubSub<{
    game: [payload: game],
    users: [payload: User[]]
    notification: [payload: Notification]
}>()




//let's think about this
//we want the chessBoard, to keep the game state updated online in real time
//so we want to keep a datatype call game, which should have all of the game data kept
//in the object, so that would be fen string, castling rights, etc. this will all be in the
//fen string so that might be enough
//we should use a redis database to keep the game

console.log(typeDefs);

const resolvers = {
  Query: {
    getChessGames: () => games,
    getChessGame: (_: unknown, { id }: { id: string }) => {
      const game = games.find((game) => game.id === id);
      if (game) {
        return game;
      }
      return null;
    },
    getUsers: () => users,
  },
  Mutation: {
    addChessGame: (
      _: unknown,
      { fen, gameId, receiverId, requesterId, requesterColor }: { fen: string, gameId: string, receiverId: string, requesterId: string, requesterColor: string},
      {pubSub}: any
    ) => {
      const game = {
        id: gameId,
        receiverId: receiverId,
        requesterId: requesterId,
        requesterColor: requesterColor,
        fen,
        turn: "white",
        moves: [],
        users: [],
        started: false
      
      };
      //here I want to make sure both users exist and are online

      pubSub.publish('game', game.id, game)
      games.push(game);
      return game;
    },
    changeFen: (
        _: unknown,
        { id, fen }: { id: string, fen: string },
        {pubSub}: any
        ) => {
            const game = games.find((game) => game.id === id);
            if (game) {
                game.fen = fen;
                pubSub.publish('game', game.id, game)
                return game;
            }
            return null;
        },
    changeChessTurn: (
        _: unknown,
        { id, turn }: { id: string, turn: string },
        {pubSub}: any
        ) => {
            const game = games.find((game) => game.id === id);
            if (game) {
                game.turn = turn;
                pubSub.publish('game', game.id, game)
                return game;
            }
            return null;
        },
    addChessUser: (
      _: unknown,
      { id, username, cat_url }: { id: string; username: string, cat_url: string},
      {pubSub}: any
    ) => {
      const notification: Notification[] = [];
      const user : User={
        id: id,
        username: username,
        last_seen: Date.now().toString(),
        cat_url: cat_url,
        notification: notification
      };
      if( users.find((user) => user.id === id) ){
          return user;
      }
      users.push(user);
      pubSub.publish("users",users)
      removeOldUsers();
      return user;
    },
    deleteChessUser: (_: unknown, { id }: { id: string }, {pubSub}: any) => {
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        let user = users[userIndex]
        users.splice(userIndex, 1);
        pubSub.publish("users",users)
        return user;
      }
      return false;
    },
    updateLastSeenChess: (_: unknown, { id }: { id: string}, {pubSub}: any) => {
        let user = users.find((user) => user.id === id);
        if (user) {
            // console.log("updating last seen")
            user.last_seen = Date.now().toString();
            pubSub.publish("users",users)
            return user;
      }
      //add user if not found

        return null;
    },
    sendChessRequest: (_: unknown, { gameId, requesterId, requesterColor, receiverId }: { gameId: string, requesterId: string, requesterColor: string, receiverId: string}, {pubSub}: any) => {
        let receiver = users.find((user) => user.id === receiverId);
        if (receiver) {
            let notification: Notification = {
                gameId: gameId,
                requesterId: requesterId,
                requesterColor: requesterColor,
                receiverId: receiverId
            }
            receiver.notification.push(notification)
            pubSub.publish("notification", notification)
            return receiver;
        }
        return false;
    },
    startChessGame: (_: unknown, { gameId}: { gameId: string}, {pubSub}: any) => {
        let game = games.find((game) => game.id === gameId);
        if (game) {
            game.started = true;
            pubSub.publish("game", game.id, game)
            return game;
        }
        return false;
    },
    moveChessPiece: (_: unknown, { from, to, endFen, gameId }: { from: string, to: string, endFen: string, gameId: string}, {pubSub}: any) => {
        let game = games.find((game) => game.id === gameId);
        if (game) {
            game.fen = endFen;
            game.moves.push({from: from, to: to, endFen: endFen});
            pubSub.publish("game", game.id, game)
            return game;
        }
        return false;
    }
  },
  Subscription: {
    chessGamesSub: {
        subscribe: (_: unknown, {id}: {id: string}, {pubSub} : any ) => {
            const game = games.find((game) => game.id === id);
            const iterator = pubSub.subscribe("game", id);
            return iterator
        },
        resolve: (payload: any) => payload
    },
    chessUsersSub: {
        subscribe:(_: unknown,{}, {pubSub}: any) => {
            const iterator = pubSub.subscribe("users");
            return iterator
        },
        resolve: (payload: any) => payload
    },
    //must modify to make user specific
    chessRequestsSub: {
        subscribe:(_: unknown,{}, {pubSub}: any) => {
            //onyl send notifications to the user if Id matches
            const iterator = pubSub.subscribe("notification");
            return iterator
        },
        resolve: (payload: any) => payload
    }
  }
};


function checkUsers(){
    users.forEach((user) => {
        if (parseInt(user.last_seen) < Date.now() - 10000){
            deleteUser(user.id)
        }
    })
}

function deleteUser(id: string){
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      let user = users[userIndex]
      users.splice(userIndex, 1);
      pubSub.publish("users",users)
      return user;
    }
    return false;
}


let clearOldUsers: any;

function removeOldUsers(){
  clearOldUsers = setInterval(checkUsers, 10000);
}
     


const schema = makeExecutableSchema({
    typeDefs: [typeDefs],
    resolvers: [resolvers],
})

const yoga = createYoga({
  schema: schema,
    context: {
        pubSub
    }
});

const server = createServer(yoga);
server.listen(4000, () => {
  console.log("Server is running on http://localhost:4000/graphql");
});
