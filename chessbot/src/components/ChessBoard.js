import React from 'react';
import ChessSquare from './ChessSquare';
import NewChessSquare from './NewChessSquare';
import { DndProvider, useDrag} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';



function ChessBoard() {

  let chessBoard = [  'r','n','b','q','k','b','n','r',
                      'p','p','p','p','p','p','p','p',
                      '-','-','-','-','-','-','-','-',
                      '-','-','-','-','-','-','-','-',
                      '-','-','-','-','-','-','-','-',
                      '-','-','-','-','-','-','-','-',
                      'P','P','P','P','P','P','P','P',
                      'R','N','B','Q','K','B','N','R',
];
let thing = 0;
let whiteFirst = true;
function getClassNameFromIndex(index){
    if (index%8==0 && index!= 0) whiteFirst = !whiteFirst;
  
    if (whiteFirst && index%2==0)
        return ' lighterBackground ';
    else if (!whiteFirst && index%2==1)
        return' lighterBackground ';
     
}
  return (
    // <DndProvider
    // backend={HTML5Backend}>
      <div className='chessBoard'>
      {chessBoard.map((square) => (
        <NewChessSquare
          index = {thing++}
          key = {thing}
          text = {square}
          chessBoard = {chessBoard}
          className = {
          getClassNameFromIndex(thing-1)
              }
        />
      ))}
    </div>
    // </DndProvider>
    
  )
}

export default ChessBoard