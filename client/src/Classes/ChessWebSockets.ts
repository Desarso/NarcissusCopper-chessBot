import { User, ChessGameUpdate, updateMove } from "./Types";
import { Accessor, Setter, createSignal } from "solid-js"
import { Board } from "./chessClasses";



export class ChessWebSocket{
    
    url = "wss://gabrielmalek.com/v1/api/chessSub";
    // url = "ws://localhost:8080/chessSub";
    ws: Accessor<WebSocket>;
    setWS: Setter<WebSocket>;
    pingsSinceResponse: number = 0;
    board : Accessor<Board>;
    setBoard: Setter<Board>;
    setUser: Setter<User>;
    user: Accessor<User>;
    pings: number = 0;
    crownedIndex: number = -1;
    moves: Accessor<updateMove[]>;
    setMoves: Setter<updateMove[]>;

    constructor(board: Accessor<Board>, setBoard: Setter<Board>, user: Accessor<User>, setUser: Setter<User>,moves: Accessor<updateMove[]>,  setMoves: Setter<updateMove[]>){
        this.board = board;
        this.setBoard = setBoard;
        this.setUser = setUser;
        this.user = user;
        let [ws, setWS] = createSignal<WebSocket>(this.createWS(this.url));
        this.ws = ws;
        console.log("ws", this.ws());
        this.setWS = setWS;
        this.createListeners();
        this.moves = moves;
        this.setMoves = setMoves;

    }

    public sendChessUpdate(board: Board, user: User, opponent: User, moves: updateMove[]){
        // console.log("sending chess update",moves)
        let chessUpdate = new ChessGameUpdate(
            board.fen,
            user,
            opponent,
            board.currentTurnColor,
            moves
        )
        this.ws().send(JSON.stringify(chessUpdate));
    }

    unloadWebSockets(){
        window.onbeforeunload = () => {
            this.ws().close();
        };
    }

    public createWS(url:string) {
        const socket = new WebSocket(url);
        return socket;
    }

    public pingWebSocket(user : User) {
        //check if websocket is open
        if (this.ws().readyState != 3) {
            // console.log("pinging ws");
           if (this.ws().readyState === 1) {
                if(this.pings < -10){
                    this.pings = 0;
                }
                if(this.pings > 5){
                    this.ws().close();
                    this.pings = 0;
                    return;
                }
                this.pings++;
                this.ws().send(JSON.stringify(user));
            }
        }
    }

    public beginPinging(user : Accessor<User>) {
        setInterval(() => {
            this.pingWebSocket(user());
        }, 3000);
    }

    public reconnectWebSocket() {
        //check if websocket is open
        this.setWS(this.createWS(this.url));
        this.createListeners();
    }

    public createListeners() {
        
        this.ws().addEventListener("open", () => {
            console.log("ws open");
        });
        this.ws().addEventListener("close", () => {
            console.log("ws closed");
            this.reconnectWebSocket();
        });
        this.ws().addEventListener("message", async (e) => {
            this.pings--;
            let data = JSON.parse(e.data);
            //process users
            if(data.users){
                this.pingsSinceResponse--;
                //we need to create event usersUpdated
                let event = new CustomEvent("usersUpdated");
                event.data = data.users;
                document.dispatchEvent(event);
            }
            //process notification
            if(data.type === "promptForGame" || data.type == "createGame" ){
                let event = new CustomEvent("notification");
                event.data = data;
                document.dispatchEvent(event);
            }

            //process game update
            if(data.type === "chessGameUpdate"){
                await this.sleep(100);
                console.log("chess game update", data);
                // console.log("equal fens", data.fen == this.board().fen)
                if(data.fen != this.board().fen){
                    console.log(data.fen, "vs", this.board().fen);
                    // check which board is older
                    let newBoard = new Board(undefined, data.fen);
                    console.log("new board", newBoard);
                    this.board().fen = data.fen;
                    this.board().board = newBoard.board;
                    this.board().currentTurnColor = newBoard.currentTurnColor;
                    this.board().capturedPieces = newBoard.capturedPieces;
                    this.board().Pieces = newBoard.Pieces;
                    this.board().checkMate = newBoard.checkMate;
                    this.board().enPassantTargetSquare = newBoard.enPassantTargetSquare;
                    this.board().halfMoveClock = newBoard.halfMoveClock;
                    this.board().fullMoveNumber = newBoard.fullMoveNumber;
                    this.board().inCheck = newBoard.inCheck;
                    this.board().legalMoves = newBoard.legalMoves;
                    this.mergeMoves(data.moves);
                    let lastMove = this.moves()[this.moves().length - 1];
                    let allDroppables = document.querySelectorAll(".chessSquare");
                    for (let i = 0; i < allDroppables.length; i++) {
                      if (
                        allDroppables[i].id === lastMove.from ||
                        allDroppables[i].id === lastMove.to
                      ) {
                        allDroppables[i]?.classList?.add("lastMove");
                      } else {
                        allDroppables[i]?.classList?.remove("lastMove");
                      }
                    }
                    let newEvent = new CustomEvent("forceBoardUpdate");
                    document.dispatchEvent(newEvent);
                    let crowned = this.pawnsAtEndOfBoard();
                    if(crowned){
                        // console.log("crowned");
                        let event = new CustomEvent("crowned");
                        event.data = newBoard;
                        document.dispatchEvent(event);
                    }
                }

            }

        });
    }

    private mergeMoves(moves: updateMove[]){
        // console.log("merging moves");
        let newMoves = [...this.moves()];
        for(let i=0; i < moves.length; i++){
            let found = false;
            for(let j=0; j < this.moves().length; j++){
                if(moves[i].from === this.moves()[j].from && moves[i].to === this.moves()[j].to ){
                    found = true;
                    if(moves[i].crowning && !this.moves()[j].crowning){
                        newMoves[j].crowning = true;
                        newMoves[j].crownedTo = moves[i].crownedTo;
                    }
                    break;
                }
            }
            if(!found){
                newMoves.push(moves[i]);
            }
        }
        console.log("new moves", newMoves);
        console.log(newMoves.length, "vs", this.moves().length, "vs", moves.length);
        this.setMoves(newMoves);

    }

    public async sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    public sendNotification(notification: Notification){
        // console.log("sending notification", notification);
        this.ws().send(JSON.stringify(notification));
    }

    private pawnsAtEndOfBoard(){
        let endTopRow = [];
        let endBottomRow = [];
        // console.log(this.board().board)
        for(let i = 0; i < 8; i++){
            if(this.board().board[i] === "P"){
                endTopRow.push(this.board().board[i]);
                this.crownedIndex = i;
            }
        }
        for(let i = 56; i < 64; i++){
            if(this.board().board[i] === "p"){
                endBottomRow.push(this.board().board[i]);
                this.crownedIndex = i;
            }
        }
        // console.log("end top row", endTopRow);
        // console.log("end bottom row", endBottomRow);
        return endTopRow.length > 0 || endBottomRow.length > 0;
    }


   

    close(){
        this.ws().close();
    }

    generateUserid() {
        //generate string of 20 digits using a for loop
        let userid = "";
        for (let i = 0; i < 20; i++) {
          userid += Math.floor(Math.random() * 10);
        }
        return userid;
      };

    
}