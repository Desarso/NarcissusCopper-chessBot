// type Props = {};
import "../css/style.css"
import { Move, TEST, Board } from "../Classes/chessClasses";
import {
  DragDropProvider,
  DragDropSensors,
  useDragDropContext,
  createDraggable,
  createDroppable,
  DragOverlay,
} from "@thisbeyond/solid-dnd";
import { For } from "solid-js";
import { DragDropContextProvider } from "./DragDropContext";
import Home from "./Home";
let mainTest = new TEST();
mainTest.runAllTests();

let board = new Board();
// board.displayBoard();
// console.log(board.board)



function Chessboard({}) {
  return <div class="chessBoard">
          <DragDropContextProvider>
            <Home/>
          </DragDropContextProvider>
          
        </div>;
}

export default Chessboard;

//all board positions will be represented using a number and a letter in the standard chess notations
//all moves will be a string of two positions or 4 if its castling
//pieces will be classes, they will be represented by a char, but will be set as a constant.
//I should do the game at a high leve logic since, the board must keep game state.
//The entire board logic should be done from high up. Then certain states that get passed down will be modified.
//Remeber to make the API clean and easy to use.
