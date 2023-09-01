// type Props = {};
import { Move, TEST } from "../Classes/chessClasses";
import { createSignal, For, Show } from "solid-js";
import { DragDropContextProvider } from "./DragDropContext";
import ChessSquare from "./ChessSquare";
let mainTest = new TEST();
mainTest.runAllTests();

type Props = {
  board: any;
  updateBoard: any;
  setLastMove: any;
  lastMove: any;
  movePieceSound: any;
  capturePieceSound: any;
};

function WhiteChessboard({
  board,
  updateBoard,
  setLastMove,
  lastMove,
  movePieceSound,
  capturePieceSound,
}: Props) {
  board().displayBoard();

  let boardIds = getBoardIds();

  //this gets the white board IDs
  //black board ID's are the same array but reversed
  function getBoardIds() {
    let boardIds = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        boardIds.push(`${String.fromCharCode(97 + j)}${8 - i}`);
      }
    }
    return boardIds;
  }
  //need to keep track of board more dynamically so that it updates better
  let eatenPieces: any = [];

  //this is the inlay responsible for pawn promotion
  const [displayInlay, setDisplayInlay] = createSignal(false);
  const [displayInlayX, setDisplayInlayX] = createSignal("00");
  const [inlaySelection, setInlaySelection] = createSignal("");

  //here I need to mount an event listener or alternatively I can just have

  let string = displayInlayX() + "0";

  async function handleSelection(selection: string) {
    setInlaySelection(selection);
    setDisplayInlay(false);
    //the index will be the bottom of the board depeiing on the color in this case
    //it is white so the bottom is 0
    //and the x-cord is 7
    //then we need to transfomr the pawn into another piece
    let piece = board().getPieceAtBoardIndex(parseInt(displayInlayX()));
    let previousType = piece.type;
    piece.type = selection.toLowerCase();

    board().board[parseInt(displayInlayX())] = selection;
    board().fen = board().boardToFen();
    // board().displayBoard();
    console.log(piece);
    let UIPiece = document.getElementById(piece.position.position)?.children[0];
    console.log("previous type:" + previousType);
    UIPiece?.classList.remove(previousType.toUpperCase());
    UIPiece?.classList.add(selection.toUpperCase());

    await delay(10);

    updateBoard();
    let move = {start: lastMove().from, end: lastMove().to};
    console.log(move);
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //later I will make a black board, and white board component and just change all the settings accordingly
  return (
    <div class="chessBoard">
      <DragDropContextProvider>
        <Show when={displayInlay()}>
          <div class={`chessInlay ml-[${displayInlayX()}]`}>
            <div
              class="chessInlaySquare"
              id="queenSelection"
              onClick={() => handleSelection("Q")}
            >
              <div class="piece Q"></div>
            </div>
            <div
              class="chessInlaySquare"
              id="knightSelection"
              onClick={() => handleSelection("N")}
            >
              <div class="piece N"></div>
            </div>
            <div
              class="chessInlaySquare"
              id="rookSelection"
              onClick={() => handleSelection("R")}
            >
              <div class="piece R"></div>
            </div>
            <div
              class="chessInlaySquare"
              id="bishopSelection"
              onClick={() => handleSelection("B")}
            >
              <div class="piece B"></div>
            </div>
          </div>
        </Show>

        <For each={board().board}>
          {(square, index) => (
            <ChessSquare
              style={index()}
              pieceClassName={board().board[index()]}
              className={`chessSquare ${
                index() % 16 < 8
                  ? index() % 2 == 0
                    ? "lighterBackground"
                    : ""
                  : index() % 2 == 0
                  ? ""
                  : "lighterBackground"
              }`}
              id={boardIds[index()]}
              board={board}
              updateBoard={updateBoard}
              draggableId={generateRandomID()}
              eatenPieces={eatenPieces}
              setDisplayInlay={setDisplayInlay}
              setDisplayInlayX={setDisplayInlayX}
              inlaySelection={inlaySelection}
              displayInlay={displayInlay}
              color="white"
              setLastMove={setLastMove}
              lastMove={lastMove}
              movePieceSound={movePieceSound}
              capturePieceSound={capturePieceSound}
            />
          )}
        </For>
      </DragDropContextProvider>
    </div>
  );
}

export default WhiteChessboard;

function generateRandomID() {
  return Math.random().toString(36).substr(2, 9);
}

//all board positions will be represented using a number and a letter in the standard chess notations
//all moves will be a string of two positions or 4 if its castling
//pieces will be classes, they will be represented by a char, but will be set as a constant.
//I should do the game at a high leve logic since, the board must keep game state.
//The entire board logic should be done from high up. Then certain states that get passed down will be modified.
//Remeber to make the API clean and easy to use.
