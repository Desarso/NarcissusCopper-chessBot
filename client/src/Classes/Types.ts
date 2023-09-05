export class Notification {
    from: User;
    to: User;
    type: string;
    constructor(from: User, to: User, type: string) {
      this.from = from;
      this.to = to;
      this.type = type;
    }
  }

  export class User {
    id: string;
    username: string;
    CatUrl  : string;
    last_seen: EpochTimeStamp = Date.now();
    inGame: boolean = false;
    constructor(id: string, username: string, CatUrl: string) {
      this.id = id;
      this.username = username;
      this.CatUrl = CatUrl;
    }

    
  }

  async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
  export class CreateGameNotification {
    from: User;
    fromUserColor: string;
    to: User;
    gameID: string;
    type: string = "createGame";
    constructor(from: User, to: User) {
      this.from = from;
      this.to = to;
      this.fromUserColor = Math.random() > 0.5 ? "white" : "black";
      this.gameID = this.generateRandomId();
    }
    generateRandomId() {
        let randomId =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        // console.log("random id", randomId);
        return randomId;
      }

  }
  
  export class Position {
    x: number;
    y: number;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  }
  
  export class VirtualMouseEvent {
    from: User;
    to: User;
    position: Position;
    screen: Position;
    type: string = "virtualMouseEvent";
    eventType: string;
    chessBoardWidth: number;
    constructor(
      from: User,
      to: User,
      position: Position,
      chessBoardWidth: number,
      eventType: string

    ) {
      this.from = from;
      this.to = to;
      this.position = position;
      this.screen = new Position(window.innerWidth, window.innerHeight);
      this.chessBoardWidth = chessBoardWidth;
      this.eventType = eventType;
    }
  }

  export class updateMove {
    from: string;
    to: string;
    previousFen: string;
    crowning: Boolean = false;
    eating: Boolean = false;
    atePiece: string = "";
    crownedTo: string = "";
    constructor(from: string, to: string, fen: string) {
      this.from = from;
      this.to = to;
      this.previousFen = fen;
    }
  }

  export class ChessGameUpdate {
    fen: string;
    from: User;
    to: User;
    type: string = "chessGameUpdate";
    turn: string;
    moves: updateMove[];
    constructor(fen: string, from: User, to: User, turn: string, moves: updateMove[]) {
      this.fen = fen;
      this.from = from;
      this.to = to;
      this.turn = turn;
      this.moves = moves;
    }
  }
  