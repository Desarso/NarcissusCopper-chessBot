import { createYoga, createPubSub} from "graphql-yoga";
import { createServer } from "node:http";
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from '@graphql-tools/schema'


const typeDefs = importSchema("./schema.gql");


interface game {
    id: string;
    blackBoardId: string;
    whiteBoardId: string;
    fen: string;
    turn : string;
}



const games: game[] = [];


const pubSub = createPubSub<{
    game: [payload: game]
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
    getGames: () => games,
    getGame: (_: unknown, { id }: { id: string }) => {
      const game = games.find((game) => game.id === id);
      if (game) {
        return game;
      }
      return null;
    },
  },
  Mutation: {
    createGame: (
      _: unknown,
      { fen, blackBoardId, whiteBoardId }: { fen: string, blackBoardId: string, whiteBoardId: string },
      {pubSub}: any
    ) => {
      const game = {
        id: `${games.length + 1}`,
        blackBoardId,
        whiteBoardId,
        fen,
        turn: "white",
      
      };
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
    changeTurn: (
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
        }
  },
  Subscription: {
    game: {
        subscribe: (_: unknown, {id}: {id: string}, {pubSub} : any ) => {
            const game = games.find((game) => game.id === id);
            const iterator = pubSub.subscribe("game", id);
            return iterator
        },
        resolve: (payload: any) => payload
    }
  }
};





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
