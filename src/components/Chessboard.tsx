// type Props = {};
import { Move, TEST, Board } from "../Classes/chessClasses";
import { For } from "solid-js";
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



  return <div class="chessBoard">
          <DragDropContextProvider>
            <For each={board.board}>
              {(square, index) => (
                <ChessSquare 
                  pieceClassName={board.board[index()]}
                  className={`chessSquare ${index() % 16 <8 ? index() % 2 == 0 ? "lighterBackground" : "" : index() % 2 == 0 ? "" : "lighterBackground"}`}
                  id={boardIds[index()]}
                  board = {board}
                  updateBoard = {updateBoard}
                  draggableId={generateRandomID()}
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
