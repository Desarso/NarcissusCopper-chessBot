// type Props = {};
import { Move, TEST, Board } from "../Classes/chessClasses";
import { createSignal, For, Show } from "solid-js";
import { DragDropContextProvider } from "./DragDropContext";
import { board } from "./WhiteChessboard";
import ChessSquare from "./ChessSquare";
let mainTest = new TEST();
mainTest.runAllTests();




// board.movePiece("e2", "e2");
board.displayBoard();
// let legalMoves = board.findLegalMoves(board);
// console.log(legalMoves);
// console.log(board.boardToFen())


let boardIds = getBoardIds();


//this gets the white board IDs
//black board ID's are the same array but reversed
function getBoardIds(){
    let boardIds = [];
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            boardIds.push(`${String.fromCharCode(97+j)}${8-i}`);
        }
    }
    return boardIds;
}

function reverseArray(array : any){
  let reversedArray = [];
  for(let i = array.length-1; i>=0; i--){
    reversedArray.push(array[i]);
  }
  return reversedArray;
}




let id = 0;

function BlackChessboard({}) {
  //need to keep track of board more dynamically so that it updates better
  let eatenPieces : any = [];


  //this is the inlay responsible for pawn promotion
  const [displayInlay, setDisplayInlay] = createSignal(false);
  const [displayInlayX, setDisplayInlayX] = createSignal(0);
  const [inlaySelection, setInlaySelection] = createSignal("");

  function updateBoard(){

    let UIboard =  document.querySelectorAll('.chessSquare');
    let UIArray = [];

    //I get the UI classes and create an array to make comparison easier
    //for black pieces all I need to do to make updateBoard work is to reverse the array
    //and then I can use the same code

    //I reverse the array to make sure the algorithm works for black pieces
    UIboard = reverseArray(UIboard);

    for(let i = 0; i < UIboard.length; i++){
      if(UIboard[i].children[0] != undefined){
        UIArray.push(UIboard[i].children[0].classList[0]);
    }else{
      UIArray.push(" ");
    }
  }

    //I loop thur the board and check mismatches, I use a space and piecebuffer
    //since I am only checking for one piece at a time

    let pieceBuffer;
    let squareBuffer;

    for(let i =0; i<64;i++){

      //here I check if there is a piece missing on the UI
      //if so I check if pieceBuffer exists
      //if so append, else  I mark the squareBuffer
      if(UIArray[i] != board.board[i]){
        if(UIArray[i] == " " && board.board[i] != " "){
          squareBuffer = UIboard[i];
          if(pieceBuffer != undefined){
            UIboard[i].appendChild(pieceBuffer);
            pieceBuffer = undefined;
          }
        //here I check if there is a piece on the UI that is not on the board
        //if so I insert the piece into the piece buffer
        //if there is a square buffer I append the piece to the square buffer
        }else if(UIArray[i] != " " && board.board[i] == " "){
          pieceBuffer = UIboard[i].children[0];
          if(squareBuffer != undefined){
            squareBuffer.appendChild(pieceBuffer);
            pieceBuffer = undefined;
            squareBuffer = undefined;
          }
        }
      }
    }
    //if there is a piece buffer left over I remove it
    if(pieceBuffer != undefined){
      pieceBuffer?.parentElement?.removeChild(pieceBuffer);
    }



  }

  //here I need to mount an event listener or alternatively I can just have


  //need to modify this to work with black board
  //basically 
function handleSelection(selection: string){
  setInlaySelection(selection);
  setDisplayInlay(false);
  //need to get the piece at the position
  //it is basically 63 - displayInlayX
  
  let piece = board.getPieceAtBoardIndex(63-(7-displayInlayX()));
  let previousType = piece.type;
  console.log(piece);
  piece.type = selection;

  board.board[63-(7-displayInlayX())] = selection;
  board.displayBoard();
  console.log(piece);
  let UIPiece = document.getElementById(piece.position.position).children[0];
  console.log("previous type:" +previousType);
  UIPiece.classList.remove(previousType);
  UIPiece.classList.add(selection);
  
  updateBoard();
}


//later I will make a black board, and white board component and just change all the settings accordingly
  return <div class="chessBoard">
          <DragDropContextProvider>

            <Show when={displayInlay()}>
            <div class={`chessInlay ml-[${7-displayInlayX()}]`}>
                <div class="chessInlaySquare" id="queenSelection" 
                  onClick={()=>handleSelection("q")}
                >
                    <section class="piece q"></section>
                </div>
                <div class="chessInlaySquare" id="knightSelection"
                  onClick={()=>handleSelection("n")}
                >
                  <section class="piece n"></section>
                </div>
                <div class="chessInlaySquare" id="rookSelection"
                  onClick={()=>handleSelection("r")}
                >
                  <section class="piece r"></section>
                </div>
                <div class="chessInlaySquare" id="bishopSelection"
                  onClick={()=>handleSelection("b")}
                >
                  <section class="piece b"></section>
                </div>
            </div>

            </Show>
           
            <For each={board.board}>
              {(square, index) => (
                <ChessSquare 
                  style={index() == 0 ?`border-top-left-radius: 40%;` : index() == 7 ? `border-top-right-radius: 40%;` : index() == 56 ? `border-bottom-left-radius: 40%;` : index() == 63 ? `border-bottom-right-radius: 40%;` : `border-radius: 0%;`}
                  pieceClassName={board.board[((board.board.length-1) - index())]}
                  className={`chessSquare ${((board.board.length-1) - index()) % 16 <8 ? ((board.board.length-1) - index()) % 2 == 0 ? "lighterBackground" : "" : ((board.board.length-1) - index()) % 2 == 0 ? "" : "lighterBackground"}`}
                  id={boardIds[((board.board.length-1) - index())]}
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
