// type Props = {};
import { Move, TEST, Board } from "../Classes/chessClasses";
import { createSignal, For, Show, Setter, Accessor } from "solid-js";
import { DragDropContextProvider } from "./DragDropContext";
import board from "./WhiteChessboard";
import { User, updateMove } from "../Classes/Types";
import ChessSquare from "./ChessSquare";
import OpponentName from "./OpponentName";
import UserName from "./UserName";
import { all } from "axios";
let mainTest = new TEST();
mainTest.runAllTests();

type Props = {
  board: any;
  updateBlackBoard: any;
  setLastMove: any;
  lastMove: any;
  movePieceSound: any;
  capturePieceSound: any;
  setMoves: Setter<updateMove[]>;
  moves: Accessor<updateMove[]>;
  user: Accessor<User>;
  opponent: Accessor<User>;
  inGame: Accessor<boolean>;
  allPieces: Accessor<HTMLElement[]>;
  setAllPieces: Setter<HTMLElement[]>;
};

// board.movePiece("e2", "e2");

let id = 0;

function BlackChessboard({
  board,
  updateBlackBoard,
  setLastMove,
  lastMove,
  movePieceSound,
  capturePieceSound,
  setMoves,
  moves,
  user,
  opponent,
  inGame,
  allPieces,
  setAllPieces
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

  //need to modify this to work with black board
  //basically
  async function handleSelection(selection: string) {
    setInlaySelection(selection);
    setDisplayInlay(false);
    let lastMove = moves()[moves().length - 1];
    lastMove.crownedTo = selection.toLowerCase();
    let newMoves = moves().splice(0, moves().length - 1);
    newMoves.push(lastMove);
    setMoves(newMoves);
    //need to get the piece at the position
    //it is basically 63 - displayInlayX

    let piece = board().getPieceAtBoardIndex(
      63 - (7 - parseInt(displayInlayX()))
    );
    let previousType = piece.type;
    console.log(piece);
    piece.type = selection;

    board().board[63 - (7 - parseInt(displayInlayX()))] = selection;
    board().fen = board().boardToFen();
    // board().displayBoard();
    console.log(piece);
    let UIPiece = document.getElementById(piece.position.position)?.children[0];
    console.log("previous type:" + previousType);
    UIPiece?.classList.remove(previousType);
    UIPiece?.classList.add(selection);

    await delay(10);

    updateBlackBoard();
    // let move = {start: lastMove().from, end: lastMove().to};
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //later I will make a black board, and white board component and just change all the settings accordingly
  return (
    <>
      <Show when={inGame()}>
        <OpponentName opponent={opponent} color="white" board={board} />
      </Show>
      <div class="chessBoard">
        <DragDropContextProvider>
          <Show when={displayInlay()}>
            <div class={`chessInlay ml-[${7 - parseInt(displayInlayX())}]`}>
              <div
                class="chessInlaySquare"
                id="queenSelection"
                onClick={() => handleSelection("q")}
              >
                <div class="piece q"></div>
              </div>
              <div
                class="chessInlaySquare"
                id="knightSelection"
                onClick={() => handleSelection("n")}
              >
                <div class="piece n"></div>
              </div>
              <div
                class="chessInlaySquare"
                id="rookSelection"
                onClick={() => handleSelection("r")}
              >
                <div class="piece r"></div>
              </div>
              <div
                class="chessInlaySquare"
                id="bishopSelection"
                onClick={() => handleSelection("b")}
              >
                <div class="piece b"></div>
              </div>
            </div>
          </Show>

          <For each={board().board}>
            {(square, index) => (
              <ChessSquare
                style={index()}
                pieceClassName={
                  board().board[board().board.length - 1 - index()]
                }
                className={`chessSquare ${
                  (board().board.length - 1 - index()) % 16 < 8
                    ? (board().board.length - 1 - index()) % 2 == 0
                      ? "lighterBackground"
                      : ""
                    : (board().board.length - 1 - index()) % 2 == 0
                    ? ""
                    : "lighterBackground"
                }`}
                id={boardIds[board().board.length - 1 - index()]}
                board={board}
                updateBoard={updateBlackBoard}
                draggableId={generateRandomID()}
                eatenPieces={eatenPieces}
                setDisplayInlay={setDisplayInlay}
                setDisplayInlayX={setDisplayInlayX}
                inlaySelection={inlaySelection}
                displayInlay={displayInlay}
                color="black"
                setLastMove={setLastMove}
                lastMove={lastMove}
                movePieceSound={movePieceSound}
                capturePieceSound={capturePieceSound}
                setMoves={setMoves}
                moves={moves}
                allPieces={allPieces}
                setAllPieces={setAllPieces}
              />
            )}
          </For>
        </DragDropContextProvider>
      </div>
      <Show when={inGame()}>
        <UserName user={user} color="black" board={board} moves={moves} allPieces={allPieces} setAllPieces={setAllPieces}/>
      </Show>
    </>
  );
}

export default BlackChessboard;

function generateRandomID() {
  return Math.random().toString(36).substr(2, 9);
}

//all board positions will be represented using a number and a letter in the standard chess notations
//all moves will be a string of two positions or 4 if its castling
//pieces will be classes, they will be represented by a char, but will be set as a constant.
//I should do the game at a high leve logic since, the board must keep game state.
//The entire board logic should be done from high up. Then certain states that get passed down will be modified.
//Remeber to make the API clean and easy to use.
