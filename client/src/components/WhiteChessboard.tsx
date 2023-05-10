// type Props = {};
import { Move, TEST } from "../Classes/chessClasses";
import { createSignal, For, Show } from "solid-js";
import { DragDropContextProvider } from "./DragDropContext";
import ChessSquare from "./ChessSquare";
let mainTest = new TEST();
mainTest.runAllTests();

type Props = {
  client:any;
  board: any;
  updateBoard: any;
  gql: any;
  gameId: string;
};

// function updateBoard(){

//   let UIboard =  document.querySelectorAll('.chessSquare');
//   let UIArray = [];

//   //I get the UI classes and create an array to make comparison easier
//   //for black pieces all I need to do to make updateBoard work is to reverse the array
//   //and then I can use the same code

//   //I reverse the array to make sure the algorithm works for black pieces
//   //UIBoard = reverseArray(UIBoard);

//   for(let i = 0; i < UIboard.length; i++){
//     if(UIboard[i].children[0] != undefined){
//       UIArray.push(UIboard[i].children[0].classList[0]);
//   }else{
//     UIArray.push(" ");
//   }
// }

//   //I loop thur the board and check mismatches, I use a space and piecebuffer
//   //since I am only checking for one piece at a time

//   let pieceBuffer;
//   let squareBuffer;

//   for(let i =0; i<64;i++){

//     //here I check if there is a piece missing on the UI
//     //if so I check if pieceBuffer exists
//     //if so append, else  I mark the squareBuffer
//     if(UIArray[i] != board.board[i]){
//       if(UIArray[i] == " " && board.board[i] != " "){
//         squareBuffer = UIboard[i];
//         if(pieceBuffer != undefined){
//           UIboard[i].appendChild(pieceBuffer);
//           pieceBuffer = undefined;
//         }
//       //here I check if there is a piece on the UI that is not on the board
//       //if so I insert the piece into the piece buffer
//       //if there is a square buffer I append the piece to the square buffer
//       }else if(UIArray[i] != " " && board.board[i] == " "){
//         pieceBuffer = UIboard[i].children[0];
//         if(squareBuffer != undefined){
//           squareBuffer.appendChild(pieceBuffer);
//           pieceBuffer = undefined;
//           squareBuffer = undefined;
//         }
//       }
//     }
//   }
//   //if there is a piece buffer left over I remove it
//   if(pieceBuffer != undefined){
//     pieceBuffer?.parentElement?.removeChild(pieceBuffer);
//   }



// }




function WhiteChessboard({board, client, updateBoard, gql, gameId}: Props) {

    board().displayBoard();



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
  //need to keep track of board more dynamically so that it updates better
  let eatenPieces : any = [];


  //this is the inlay responsible for pawn promotion
  const [displayInlay, setDisplayInlay] = createSignal(false);
  const [displayInlayX, setDisplayInlayX] = createSignal("00");
  const [inlaySelection, setInlaySelection] = createSignal("");



  //here I need to mount an event listener or alternatively I can just have

let string = displayInlayX() + "0";

function handleSelection(selection: string){
  setInlaySelection(selection);
  setDisplayInlay(false);
  //the index will be the bottom of the board depeiing on the color in this case
  //it is white so the bottom is 0
  //and the x-cord is 7
  //then we need to transfomr the pawn into another piece
  let piece = board().getPieceAtBoardIndex(parseInt(displayInlayX()));
  let previousType = piece.type;
  piece.type = selection;

  board().board[parseInt(displayInlayX())] = selection;
  board().displayBoard();
  console.log(piece);
  let UIPiece = document.getElementById(piece.position.position)?.children[0];
  console.log("previous type:" +previousType);
  UIPiece?.classList.remove(previousType.toUpperCase());
  UIPiece?.classList.add(selection.toUpperCase());
  
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
           
            <For each={board().board}>
              {(square, index) => (
                <ChessSquare 
                  style={index() == 0 ?`border-top-left-radius: 40%;` : index() == 7 ? `border-top-right-radius: 40%;` : index() == 56 ? `border-bottom-left-radius: 40%;` : index() == 63 ? `border-bottom-right-radius: 40%;` : `border-radius: 0%;`}
                  pieceClassName={board().board[index()]}
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
                  color = "white"
                  client = {client}
                  gql = {gql}
                  gameId = {gameId}
                  />
              )}
            </For>

          </DragDropContextProvider>
          
        </div>;
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
