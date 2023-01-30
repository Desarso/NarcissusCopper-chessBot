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
    //there is UI problem.

    //for the mismatch there should be 2 mismatches
    //one will the the piece
    //on will be the empty space
    //all I need to do is figure out the two ID's
    //for the elements
    //then I grab the children from the populated square,
    //and put it in the  emtpy square
    //then I re-check to make sure the board matches.
    //this is purely UI I don't need to update the board
    let mismatchStart = "";
    let mismatchEnd = "";
    for(let i = 0; i < UIboard.length; i++){
      if(UIboard[i].children[0] != undefined){
        if(UIboard[i].children[0].classList[0] != board.board[i]){
          //if there is a mismatch, then we need to update the UI board
          //first I need to figure what the mismatch is.
          // console.log(UIboard[i].children[0].parentElement.id)

          // console.log("mismatch");
          mismatchStart = UIboard[i].id;
        }
      }else{
        if(board.board[i] != " "){
          // console.log("mismatch");
          mismatchEnd = UIboard[i].id;
        }
      }
    }
    if(mismatchStart != "" && mismatchEnd != ""){
      console.log("Mismatch end: " + mismatchEnd);
      console.log("Mismatch start: " + mismatchStart);
      let piece = document.getElementById(mismatchStart).children[0];
      let endSpot = document.getElementById(mismatchEnd);
      endSpot.appendChild(piece);
      // console.log(piece);
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
