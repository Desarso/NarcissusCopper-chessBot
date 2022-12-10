import { nextHydrateContext } from "solid-js/types/render/hydration";

export class Move {
  start: string;
  end: string;
  boardStartIndex: number;
  boardEndIndex: number;

  constructor(start: string, end: string) {
    this.start = start;
    this.end = end;
    this.boardStartIndex = this.convertToBoardIndex(this.start);
    this.boardEndIndex = this.convertToBoardIndex(this.end);
  }

  private convertToBoardIndex(position: string): number {
    //converts a string to a board index
    if (position.length != 2) {
      throw new Error("Invalid position");
    }
    let letter = position[0];
    let number = position[1];
    let letterIndex = letter.charCodeAt(0) - 97;
    //
    // let numberIndex = parseInt(number) - 1
    let numberIndex = 8 - parseInt(number);

    return letterIndex + numberIndex * 8;
  }

  private testConverToBoardIndex() {
    let tests = [];
    tests.push(this.convertToBoardIndex("a8") == 0);
    tests.push(this.convertToBoardIndex("b8") == 1);
    tests.push(this.convertToBoardIndex("c8") == 2);
    tests.push(this.convertToBoardIndex("d8") == 3);
    tests.push(this.convertToBoardIndex("e8") == 4);
    tests.push(this.convertToBoardIndex("f8") == 5);
    tests.push(this.convertToBoardIndex("g8") == 6);
    tests.push(this.convertToBoardIndex("h8") == 7);
    tests.push(this.convertToBoardIndex("a7") == 8);
    tests.push(this.convertToBoardIndex("b7") == 9);
    tests.push(this.convertToBoardIndex("c7") == 10);
    tests.push(this.convertToBoardIndex("d7") == 11);
    tests.push(this.convertToBoardIndex("e7") == 12);
    tests.push(this.convertToBoardIndex("f7") == 13);
    tests.push(this.convertToBoardIndex("g7") == 14);
    tests.push(this.convertToBoardIndex("h7") == 15);
    tests.push(this.convertToBoardIndex("a6") == 16);
    for (let i = 0; i < tests.length; i++) {
      if (!tests[i]) {
        throw new Error("Convert to board Index failed failed");
      }
    }
  }

  runAllTests() {
    this.testConverToBoardIndex();

    console.log("All tests ran for move class");
  }
  //move here consists of two string, problem is that I need to convert the string to a board index for it to be useful
}

export class Position{
  position: string;
  boardIndex : number;
  constructor(position?: string, boardIndex?: number){
    if(position){
      this.position = position;
      this.boardIndex = this.convertToBoardIndex(position);
    }else if(boardIndex){
      this.boardIndex = boardIndex;
      this.position = this.convertToBoardPosition(boardIndex);
    }else{
      this.position = "a8";
      this.boardIndex = 0;
    }
  }
  moveTo(position: string){
    this.position = position;
    this.boardIndex = this.convertToBoardIndex(position);
  }

  getPosition(){
    return this.position;
  }
  getIndex(){
    return this.boardIndex;
  }

  private convertToBoardIndex(position: string): number {
    //converts a string to a board index
    if (position.length != 2) {
      throw new Error("Invalid position");
    }
    let letter = position[0];
    let number = position[1];
    let letterIndex = letter.charCodeAt(0) - 97;
    //
    // let numberIndex = parseInt(number) - 1
    let numberIndex = 8 - parseInt(number);

    return letterIndex + numberIndex * 8;
  }
  
 

  private testConvertToBoardIndex(): void{
    let tests = [];
    tests.push(this.convertToBoardIndex("a8") == 0);
    tests.push(this.convertToBoardIndex("b8") == 1);
    tests.push(this.convertToBoardIndex("c8") == 2);
    tests.push(this.convertToBoardIndex("d8") == 3);
    tests.push(this.convertToBoardIndex("e8") == 4);
    tests.push(this.convertToBoardIndex("f8") == 5);
    tests.push(this.convertToBoardIndex("g8") == 6);
    tests.push(this.convertToBoardIndex("h8") == 7);
    tests.push(this.convertToBoardIndex("a7") == 8);
    tests.push(this.convertToBoardIndex("b7") == 9);
    tests.push(this.convertToBoardIndex("c7") == 10);
    tests.push(this.convertToBoardIndex("d7") == 11);
    tests.push(this.convertToBoardIndex("e7") == 12);
    tests.push(this.convertToBoardIndex("f7") == 13);
    tests.push(this.convertToBoardIndex("g7") == 14);
    tests.push(this.convertToBoardIndex("h7") == 15);
    tests.push(this.convertToBoardIndex("a6") == 16);
    for (let i = 0; i < tests.length; i++) {
      if (!tests[i]) {
        throw new Error("Convert to board Index failed failed");
      }
    }

  
  }

  private convertToBoardPosition(boardIndex: number): string {
    //converts a string to a board index
    let letterIndex = boardIndex % 8;
    let numberIndex = Math.floor(boardIndex / 8);
    let letter = String.fromCharCode(letterIndex + 97);
    let number = 8 - numberIndex;
    return letter + number;
  }

  private testConvertToPosition() {
    let tests = [];
    tests.push(this.convertToBoardPosition(0) == "a8");
    tests.push(this.convertToBoardPosition(0) == "a8");
    tests.push(this.convertToBoardPosition(0) == "a8");
    tests.push(this.convertToBoardPosition(1) == "b8");
    tests.push(this.convertToBoardPosition(2) == "c8");
    tests.push(this.convertToBoardPosition(3) == "d8");
    tests.push(this.convertToBoardPosition(4) == "e8");
    tests.push(this.convertToBoardPosition(5) == "f8");
    tests.push(this.convertToBoardPosition(6) == "g8");
    tests.push(this.convertToBoardPosition(7) == "h8");
    tests.push(this.convertToBoardPosition(8) == "a7");
    tests.push(this.convertToBoardPosition(9) == "b7");
    tests.push(this.convertToBoardPosition(10) == "c7");
    tests.push(this.convertToBoardPosition(11) == "d7");
    tests.push(this.convertToBoardPosition(12) == "e7");
    tests.push(this.convertToBoardPosition(13) == "f7");
    tests.push(this.convertToBoardPosition(14) == "g7");
    tests.push(this.convertToBoardPosition(15) == "h7");
    tests.push(this.convertToBoardPosition(16) == "a6");
    for (let i = 0; i < tests.length; i++) {
      if (!tests[i]) {
        throw new Error("Convert to position failed");
      }
    }
  }

  runAllTests() {
    this.testConvertToBoardIndex();
    this.testConvertToPosition();
    console.log("All tests ran for position class");
  }

}

export class Piece {
  private position: Position;
  color: string;
  type: string;

  constructor(position: string, color: string, type: string) {
    this.position = new Position(position);
    this.color = color;
    this.type = type;
  }

  public move(end: string) {
    //moves the piece
    this.position.moveTo(end);
  }

  public getPosition(): string {
    return this.position.getPosition();
  }

  public getIndex(): number {
    return this.position.getIndex();
  }

  private convertToBoardIndex(position: string): number {
    //converts a string to a board index
    if (position.length != 2) {
      throw new Error("Invalid position");
    }
    let letter = position[0];
    let number = position[1];
    let letterIndex = letter.charCodeAt(0) - 97;
    //
    // let numberIndex = parseInt(number) - 1
    let numberIndex = 8 - parseInt(number);

    return letterIndex + numberIndex * 8;
  }

  private testConverToBoardIndex() {
    let tests = [];
    tests.push(this.convertToBoardIndex("a8") == 0);
    tests.push(this.convertToBoardIndex("b8") == 1);
    tests.push(this.convertToBoardIndex("c8") == 2);
    tests.push(this.convertToBoardIndex("d8") == 3);
    tests.push(this.convertToBoardIndex("e8") == 4);
    tests.push(this.convertToBoardIndex("f8") == 5);
    tests.push(this.convertToBoardIndex("g8") == 6);
    tests.push(this.convertToBoardIndex("h8") == 7);
    tests.push(this.convertToBoardIndex("a7") == 8);
    tests.push(this.convertToBoardIndex("b7") == 9);
    tests.push(this.convertToBoardIndex("c7") == 10);
    tests.push(this.convertToBoardIndex("d7") == 11);
    tests.push(this.convertToBoardIndex("e7") == 12);
    tests.push(this.convertToBoardIndex("f7") == 13);
    tests.push(this.convertToBoardIndex("g7") == 14);
    tests.push(this.convertToBoardIndex("h7") == 15);
    tests.push(this.convertToBoardIndex("a6") == 16);
    for (let i = 0; i < tests.length; i++) {
      if (!tests[i]) {
        throw new Error("Convert to board Index failed failed");
      }
    }
  }

  runAllTests() {
    this.testConverToBoardIndex();
    console.log("All tests ran for piece class");
  }
}

export class Board {
  Pieces: Piece[];
  currentTurnColor: string = "white";
  fen: string = "";
  halfMoveClock: number = 0;
  fullMoveNumber: number = 1;
  castlingRights: string = "KQkq";
  enPassantTargetSquare: string = "-";
  legalMoves: Move[] = [];
  inCheck = [false, false];

  //constructor creates a board with all the pieces in their starting positions
  constructor(board?: string[], fen?: string) {
    if(!board){
        board = [
            "r",
            "n",
            "b",
            "q",
            "k",
            "b",
            "n",
            "r",
            "p",
            "p",
            "p",
            "p",
            "p",
            "p",
            "p",
            "p",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
            "R",
            "N",
            "B",
            "Q",
            "K",
            "B",
            "N",
            "R",
          ];
    }
    const fenregex =
      /^([rnbqkpRNBQKP1-8]+\/){7}([rnbqkpRNBQKP1-8]+)\s[bw]\s(-|K?Q?k?q?)\s(-|[a-h][36])\s(0|[1-9][0-9]*)\s([1-9][0-9]*)/;

    if (fen != undefined && fen.match(fenregex)) {
      let parts = fen.split(" ");
      board = this.fenToBoard(fen);
      console.log(board);
      this.castlingRights = parts[2];
      this.enPassantTargetSquare = fen.split(" ")[3];
      parts[1] === "w" ? this.currentTurnColor = "white" : this.currentTurnColor = "black";
      this.halfMoveClock = parseInt(parts[4]);
      this.fullMoveNumber = parseInt(parts[5]);
    }



    this.Pieces = [];
    for (let i = 0; i < board.length; i++) {
      let piece = board[i];
      if (piece != " ") {
        let color = piece == piece.toUpperCase() ? "white" : "black";
        let type = piece.toLowerCase();
        let position = this.convertToPosition(i);
        console.log(fen);
        this.Pieces.push(new Piece(position, color, type));
      }
    }
    fen != undefined ? (this.fen = fen) : (this.fen = this.boardToFen());
  }

  private convertToPosition(boardIndex: number): string {
    //converts index to position
    let letter = String.fromCharCode(97 + (boardIndex % 8));
    let number = 8 - Math.floor(boardIndex / 8);
    return letter + number;
  }



  private fenToBoard(fen: string): string[] {
    let board = [];
    let fenArray = fen.split(" ");
    let fenBoard = fenArray[0];
    //contains the board in fen notation
    let fenBoardArray = fenBoard.split("/");

    for (let i = 0; i < fenBoardArray.length; i++) {
      let row = fenBoardArray[i];
      let rowArray = row.split("");
      console.log(rowArray, i);
      for (let j = 0; j < rowArray.length; j++) {
        let piece = rowArray[j];
        if (piece.match(/[1-8]/)) {
          for (let k = 0; k < parseInt(piece); k++) {
            board.push(" ");
          }
        } else {
          board.push(piece);
        }
      }
    }

    return board;
  }

  private boardToFen(): string {
    let fen = "";
    let emptySpaces = 0;
    //write a a loop that converst my array of pieces into 
    //a fen string);
    for(let i = 0; i < 64; i++){
      let Piece = this.getPieceAtBoardIndex(i);
      if(Piece === ""){
        emptySpaces++;
        if(emptySpaces === 8 && i !== 63){
          fen += emptySpaces;
          fen += "/";
          emptySpaces = 0;
        }else if(i % 8 === 7 && i !== 63){
          fen += emptySpaces;
          fen += "/";
          emptySpaces = 0;
        }
      }
      else{
        if(emptySpaces !== 0){
          fen += emptySpaces;
          emptySpaces = 0;
        }
        fen += Piece.color === "white" ? Piece.type.toUpperCase() : Piece.type.toLowerCase();
        if(Piece.getIndex() % 8 === 7 && i !== 63){
          fen += "/";
          emptySpaces = 0;
        }
      }
      

    }

    fen += " " + this.currentTurnColor[0] + " ";
    fen += this.castlingRights + " ";
    fen += this.enPassantTargetSquare + " ";
    fen += this.halfMoveClock + " ";
    fen += this.fullMoveNumber;
    return fen;
  }

  private getPieceAtBoardIndex(index: number): any {
    for(let j = 0; j < this.Pieces.length; j++){
      if(this.Pieces[j].getIndex() === index){
          return this.Pieces[j];
      }
    }
      return ("");
  }

  private movePiece(start: string, end: string): void {

    let newMove = new Move(start, end);
    newMove.boardEndIndex;
    //so move first gets the current piece index
    let pieceIndex = this.getPieceIndex(start);
    //then it gets the piece at that index
    let piece = this.Pieces[pieceIndex];

      //check if the piece is a pawn, and it if moved twice.
    if (piece.type == "p" && Math.abs(piece.getIndex() - newMove.boardEndIndex) == 16) {
      let enPassant;
      if(piece.color === "white"){
        enPassant = this.convertToPosition(newMove.boardEndIndex + 8);
      }else{
        enPassant = this.convertToPosition(newMove.boardEndIndex - 8);
      }
      this.enPassantTargetSquare = enPassant;
    }
    //then it sets the piece's position to  end position
    piece.move(end);
    this.currentTurnColor = this.currentTurnColor === "white" ? "black" : "white";
  

    //then it sets the fen to the new fen
    this.fen = this.boardToFen();
  }

  private getPieceIndex(position: string): number {
    let index = -1;
    for (let i = 0; i < this.Pieces.length; i++) {
      let piece = this.Pieces[i];
      if (piece.getPosition() == position) {
        index = i;
        break;
      }
    }
    return index;
  }

  private testConvertToPosition() {
    let tests = [];
    tests.push(this.convertToPosition(0) == "a8");
    tests.push(this.convertToPosition(1) == "b8");
    tests.push(this.convertToPosition(2) == "c8");
    tests.push(this.convertToPosition(3) == "d8");
    tests.push(this.convertToPosition(4) == "e8");
    tests.push(this.convertToPosition(5) == "f8");
    tests.push(this.convertToPosition(6) == "g8");
    tests.push(this.convertToPosition(7) == "h8");
    tests.push(this.convertToPosition(8) == "a7");
    tests.push(this.convertToPosition(9) == "b7");
    tests.push(this.convertToPosition(10) == "c7");
    tests.push(this.convertToPosition(11) == "d7");
    tests.push(this.convertToPosition(12) == "e7");
    tests.push(this.convertToPosition(13) == "f7");
    tests.push(this.convertToPosition(14) == "g7");
    tests.push(this.convertToPosition(15) == "h7");
    tests.push(this.convertToPosition(16) == "a6");
    for (let i = 0; i < tests.length; i++) {
      if (!tests[i]) {
        throw new Error("Convert to position failed");
      }
    }
  }

  private testFenToBoard() { 
    let tests = [];
    tests.push(
      this.fenToBoard(
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      )
    );
    tests.push(
      this.fenToBoard(
        "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
      )
    );

    for (let i = 0; i < tests.length; i++) {
      if (!tests[i]) {
        throw new Error("Fen to board failed");
      }
    }
    ASSERT(tests[0], [
      "r",
      "n",
      "b",
      "q",
      "k",
      "b",
      "n",
      "r",
      "p",
      "p",
      "p",
      "p",
      "p",
      "p",
      "p",
      "p",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      "P",
      "P",
      "P",
      "P",
      "P",
      "P",
      "P",
      "P",
      "R",
      "N",
      "B",
      "Q",
      "K",
      "B",
      "N",
      "R",
    ]);
    ASSERT(tests[1], [
      "r",
      "n",
      "b",
      "q",
      "k",
      "b",
      "n",
      "r",
      "p",
      "p",
      "p",
      "p",
      "p",
      "p",
      "p",
      "p",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      "P",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      "P",
      "P",
      "P",
      "P",
      " ",
      "P",
      "P",
      "P",
      "R",
      "N",
      "B",
      "Q",
      "K",
      "B",
      "N",
      "R",
    ]);

    function ASSERT(test: any, expected: any) {
      if (test === expected) return true;
      if (test == null || expected == null) {
        console.log(test, expected);
        throw new Error("Fen to board failed");
      }
      if (test.length !== expected.length) {
        console.log(test, expected);
        throw new Error("Fen to board failed");
      }

      for (var i = 0; i < test.length; ++i) {
        if (test[i] !== expected[i]) {
          console.log(test, expected);
          throw new Error("Fen to board failed");
        }
      }
      return true;
    }

    // console.log("Fen to board passed");
  }

  private testBoardToFen() {
    let tests = [];
    let board = new Board();
    // console.log("Pieces",this.Pieces);
    tests.push(
      board.boardToFen() ==
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    );
    //move piece must change turn, and also I must track the square
    //if a pawn moves two squares, then I must track the square
    board.movePiece("e2", "e4");
    tests.push(
      board.boardToFen() ==
        "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
    );
    // console.log(board.boardToFen());
    // console.log("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1")
    for (let i = 0; i < tests.length; i++) {
      if (!tests[i]) {
        throw new Error("Board to fen failed, test " + (i+1) + " failed");
      }
    }
    // console.log("Board to fen passed");
  }

  private testConstructors() {
    let board: Board = new Board();
    let tests = [];
    tests.push(board.Pieces[0]?.getPosition() == "a8");
    tests.push(board.Pieces[0].color == "black");
    tests.push(board.Pieces[0].type == "r");
    tests.push(board.Pieces[1]?.getPosition() == "b8");
    tests.push(board.Pieces[1].color == "black");
    tests.push(board.Pieces[1].type == "n");
    tests.push(board.Pieces[2]?.getPosition() == "c8");
    tests.push(board.Pieces[2].color == "black");
    tests.push(board.Pieces[2].type == "b");
    tests.push(board.Pieces[3]?.getPosition() == "d8");
    
    for(let i = 0; i < tests.length; i++) {
      if(!tests[i]) {
        throw new Error("Board constructor 1 failed "+i);
      }
    };

    let newBoard = new Board([],"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    tests = [];
    tests.push(newBoard.Pieces[0]?.getPosition() == "a8");
    tests.push(newBoard.Pieces[0].color == "black");
    tests.push(newBoard.Pieces[0].type == "r");
    tests.push(newBoard.Pieces[1]?.getPosition() == "b8");
    tests.push(newBoard.Pieces[1].color == "black");
    tests.push(newBoard.Pieces[1].type == "n");
    tests.push(newBoard.Pieces[2]?.getPosition() == "c8");
    tests.push(newBoard.Pieces[2].color == "black");
    tests.push(newBoard.Pieces[2].type == "b");
    tests.push(newBoard.Pieces[3]?.getPosition() == "d8");

    for(let i = 0; i < tests.length; i++) {
        if(!tests[i]) {
            throw new Error("Board constructor 2 failed"+i,);
        }
    }

    let newBoard2 = new Board([],"rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");

    tests = [];
    tests.push(newBoard2.Pieces[0]?.getPosition() == "a8");
    tests.push(newBoard2.Pieces[0].color == "black");
    tests.push(newBoard2.Pieces[0].type == "r");
    tests.push(newBoard2.currentTurnColor == "black");

    for(let i = 0; i < tests.length; i++) {
        if(!tests[i]) {
            throw new Error("Board constructor 3 failed"+i);
        }
    }

    // let boards = [];
    // for(let i = 0; i < 100; i++) {
    //   boards.push(new Board());
    // }

    // for(let i = 0; i < boards.length; i++) {
    //   for(let j = 0; j < 100; j++) {
    //     boards[i].move(this.generateRandomMoves(boards[i]));
    //   }
    // }

  }

  private findLegalMoves(board : Board) : Move[] {
    let moves = [];
    for(let i = 0; i < board.Pieces.length; i++) {
      let currentPiece = board.Pieces[i];
      //for each move I must check first if I am in check from board.
      // I can keep track of this since I start out of check
      //then whenever I move 
      switch(currentPiece.type) {
        case "p":
          moves.push(this.findPawnMoves(currentPiece));
          break;
        case "r":
          moves.push(this.findRookMoves(currentPiece));
          break;
        case "n":
          moves.push(this.findKnightMoves(currentPiece));
          break;
        case "b":
          moves.push(this.findBishopMoves(currentPiece));
          break;
        case "q":
          moves.push(this.findQueenMoves(currentPiece));
          break;
        case "k":
          moves.push(this.findKingMoves(currentPiece));
          break;
      }
    }
    return moves;
  }

  //come back to this once we can generate all valid moves and put them in an array.2
  // private generateRandomMoves(board : string []): Move {
  //   //it's time for me to create the functions that find board moves.
  //   let moves = board.generateMoves();

  //   let randomIndex = Math.floor(Math.random() * moves.length);
  //   return moves[randomIndex];
  // }



  runAllTests() {
    this.testConvertToPosition();
    this.testConstructors();
    this.testBoardToFen();
    this.testFenToBoard();

    console.log("All tests ran for board class");
  }
}

export class TEST {
  runAllTests() {
    let move = new Move("a2", "a4");
    move.runAllTests();
    let position = new Position("a2");
    position.runAllTests();
    let piece = new Piece("a2", "white", "pawn");
    piece.runAllTests();
    let board = new Board();
    board.runAllTests();
    console.log("All tests ran for chessClasses.ts");
  }
}

//so by default, the board starts out with default position;
//so the contructor for board should automagically populate the board.
