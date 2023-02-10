// type Props = {};
import { Move, TEST, Board } from "../Classes/chessClasses";
import { createSignal, For, Show } from "solid-js";
import { DragDropContextProvider } from "./DragDropContext";
import ChessSquare from "./ChessSquare";
let mainTest = new TEST();
mainTest.runAllTests();



let board = new Board();
// board.movePiece("e2", "e2");
board.displayBoard();
// let legalMoves = board.findLegalMoves(board);
// console.log(legalMoves);
// console.log(board.boardToFen())


let boardIds = getBoardIds();

function getBoardIds(){
    let boardIds = [];
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            boardIds.push(`${String.fromCharCode(97+j)}${8-i}`);
        }
    }
    return boardIds;
}




let id = 0;

function Chessboard({}) {
  //need to keep track of board more dynamically so that it updates better
  let eatenPieces : any = [];

  const [displayInlay, setDisplayInlay] = createSignal(false);
  const [displayInlayX, setDisplayInlayX] = createSignal("00");
  const [inlaySelection, setInlaySelection] = createSignal("");

  function updateBoard(){
    let UIboard =  document.querySelectorAll('.chessSquare');
    let UIArray = [];

    //I need to get an array version of the UI board
    //the is a big problem the pieces are not draggable after I switch them
    for(let i = 0; i < UIboard.length; i++){
      if(UIboard[i].children[0] != undefined){
        UIArray.push(UIboard[i].children[0].classList[0]);
    }else{
      UIArray.push(" ");
    }
  }

    //I just need to loop thru 64 times, and check that the
    //board and UI match, and if they don't I just force the UI to match the board

    let pieceBuffer;
    let squareBuffer;
    for(let i =0; i<64;i++){
      if(UIArray[i] != board.board[i]){
        if(UIArray[i] == " " && board.board[i] != " "){
          //here I need to create an element and append it to the UI
          //this is a big problem because I can't simply create a draggable I need to move an existing piece.
          // let piece = document.createElement("section");
          // piece.classList.add(board.board[i]);
          // piece.classList.add("piece");
          // piece.id = generateRandomID();
          // UIboard[i].appendChild(piece);
          squareBuffer = UIboard[i];
          if(pieceBuffer != undefined){
            UIboard[i].appendChild(pieceBuffer);
            pieceBuffer = undefined;
          }
        }else if(UIArray[i] != " " && board.board[i] == " "){
          //here I need to remove the element from the UI
          //here I remove the piece, and I will only actually remove it later
          //if the piece buffer is still fill after the loop problem is I might find the piece before I find the square
          pieceBuffer = UIboard[i].children[0];
          if(squareBuffer != undefined){
            squareBuffer.appendChild(pieceBuffer);
            pieceBuffer = undefined;
            squareBuffer = undefined;
          }
        }
      }
    }
    if(pieceBuffer != undefined){
      pieceBuffer?.parentElement?.removeChild(pieceBuffer);
    }



  }

  //here I need to mount an event listener or alternatively I can just have

let string = displayInlayX() + "0";

function handleSelection(selection: string){
  setInlaySelection(selection);
  setDisplayInlay(false);
  //the index will be the bottom of the board depeiing on the color in this case
  //it is white so the bottom is 0
  //and the x-cord is 7
  //then we need to transfomr the pawn into another piece
  let piece = board.getPieceAtBoardIndex(parseInt(displayInlayX()));
  let previousType = piece.type;
  piece.type = selection;

  board.board[parseInt(displayInlayX())] = selection;
  board.displayBoard();
  console.log(piece);
  let UIPiece = document.getElementById(piece.position.position).children[0];
  console.log("previous type:" +previousType);
  UIPiece.classList.remove(previousType.toUpperCase());
  UIPiece.classList.add(selection.toUpperCase());
  
  updateBoard();
}


//later I will make a black board, and white board component and just change all the settings accordingly
  return <div class="chessBoard">
          <DragDropContextProvider>

            <Show when={displayInlay()}>
            <div class={`chessInlay ml-[${displayInlayX()}]`}>
                <div class="chessInlaySquare" id="queenSelection" 
                  onClick={()=>handleSelection("q")}
                >
                    <section class="piece Q"></section>
                </div>
                <div class="chessInlaySquare" id="knightSelection"
                  onClick={()=>handleSelection("n")}
                >
                  <section class="piece N"></section>
                </div>
                <div class="chessInlaySquare" id="rookSelection"
                  onClick={()=>handleSelection("r")}
                >
                  <section class="piece R"></section>
                </div>
                <div class="chessInlaySquare" id="bishopSelection"
                  onClick={()=>handleSelection("b")}
                >
                  <section class="piece B"></section>
                </div>
            </div>

            </Show>
           
            <For each={board.board}>
              {(square, index) => (
                <ChessSquare 
                  pieceClassName={board.board[index()]}
                  className={`chessSquare ${index() % 16 <8 ? index() % 2 == 0 ? "lighterBackground" : "" : index() % 2 == 0 ? "" : "lighterBackground"}`}
                  id={boardIds[index()]}
                  board = {board}
                  updateBoard = {updateBoard}
                  draggableId={generateRandomID()}
                  eatenPieces = {eatenPieces}
                  setDisplayInlay = {setDisplayInlay}
                  setDisplayInlayX = {setDisplayInlayX}
                  inlaySelection = {inlaySelection}
                  displayInlay = {displayInlay}
                  />
              )}
            </For>

          </DragDropContextProvider>
          
        </div>;
}

export default Chessboard;


function generateRandomID() {
    return Math.random().toString(36).substr(2, 9);
}



//all board positions will be represented using a number and a letter in the standard chess notations
//all moves will be a string of two positions or 4 if its castling
//pieces will be classes, they will be represented by a char, but will be set as a constant.
//I should do the game at a high leve logic since, the board must keep game state.
//The entire board logic should be done from high up. Then certain states that get passed down will be modified.
//Remeber to make the API clean and easy to use.
