import { createSignal, createEffect } from "solid-js";
import ChessSquare from "./ChessSquare";
import { NewDragNDrop } from "./NewDragNDrop";
import {
    DragDropProvider,
    DragDropSensors,
    useDragDropContext,
    createDraggable,
    createDroppable,
    DragOverlay
  } from "@thisbeyond/solid-dnd";


function ChessBoard() {
    const [activeItem, setActiveItem] = createSignal(null);
    const [hoveredElement, setHovered] = createSignal(null);
    const [previousMove, setPreviousMove] = createSignal([70,70]);
    const [chessBoard, setChessBoard] = createSignal([  't','n','b','q','k','b','n','t',
                                                        'p','p','p','p','p','p','p','p',
                                                        '-','-','-','-','-','-','-','-',
                                                        '-','-','-','-','-','-','-','-',
                                                        '-','-','-','-','-','-','-','-',
                                                        '-','-','-','-','-','-','-','-',
                                                        'P','P','P','P','P','P','P','P',
                                                        'T','N','B','Q','K','B','N','T',]);

    const [litUpBoxes, setLitUpBoxes] = createSignal(['-','-','-','-','-','-','-','-',
                                                    '-','-','-','-','-','-','-','-',
                                                    '-','-','-','-','-','-','-','-',
                                                    '-','-','-','-','-','-','-','-',
                                                    '-','-','-','-','-','-','-','-',
                                                    '-','-','-','-','-','-','-','-',
                                                    '-','-','-','-','-','-','-','-',
                                                    '-','-','-','-','-','-','-','-']);                                     
    
    const [boardClass, setBoardClass] = createSignal([  '-','-','-','-','-','-','-','-',
                                                        '-','-','-','-','-','-','-','-',
                                                        '-','-','-','-','-','-','-','-',
                                                        '-','-','-','-','-','-','-','-',
                                                        '-','-','-','-','-','-','-','-',
                                                        '-','-','-','-','-','-','-','-',
                                                        '-','-','-','-','-','-','-','-',
                                                        '-','-','-','-','-','-','-','-'
                                                        ]);  
    const [pieceClass, setPieceClass] = createSignal([]);

   
                                                        

    
    

    createEffect(() => {

        // console.log(chessBoard());
        let newPieceClasses = [];
        for(let i=0;i<chessBoard().length;i++){
            if(chessBoard()[i] === '-') newPieceClasses.push('-'); 
            if(chessBoard()[i] === 't' || chessBoard()[i] === 'r'){newPieceClasses.push('piece rook');}
            if(chessBoard()[i] === 'b')  newPieceClasses.push('piece bishop');
            if(chessBoard()[i] === 'n')  newPieceClasses.push('piece knight');
            if(chessBoard()[i] === 'k')  newPieceClasses.push('piece king');
            if(chessBoard()[i] === 'q')  newPieceClasses.push('piece queen');
            if(chessBoard()[i] === 'p')  newPieceClasses.push('piece pawn');
            if(chessBoard()[i] === 'T' || chessBoard()[i] === 'R')  newPieceClasses.push('piece white rook');
            if(chessBoard()[i] === 'B') newPieceClasses.push('piece white bishop');
            if(chessBoard()[i] === 'N') newPieceClasses.push('piece white knight');
            if(chessBoard()[i] === 'K') newPieceClasses.push('piece white king');
            if(chessBoard()[i] === 'Q') newPieceClasses.push('piece white queen');
            if(chessBoard()[i] === 'P') newPieceClasses.push('piece white pawn');
        }
        console.log("setting things");
        // console.log(newPieceClasses);
        setPieceClass(newPieceClasses);
    },chessBoard)


    let thing = 0;
    let whiteFirst = true;
    // function getClassNameFromIndex(index){
    //     // console.log(index);
    //     if (index%8==0 && index!= 0) whiteFirst = !whiteFirst;
    
    //     if (whiteFirst && index%2==0)
    //         return ' lighterBackground ';
    //     else if (!whiteFirst && index%2==1)
    //         return' lighterBackground ';
    //     else 
    //         return '';
    // }
    function handleBoardChange(newBoard){
        setChessBoard(newBoard);
        let newPieceClasses = [];
        for(let i=0;i<newBoard.length;i++){
            if(newBoard[i] === '-') newPieceClasses.push('-'); 
            if(newBoard[i] === 't' || newBoard[i] === 'r'){newPieceClasses.push('piece rook');}
            if(newBoard[i] === 'b')  newPieceClasses.push('piece bishop');
            if(newBoard[i] === 'n')  newPieceClasses.push('piece knight');
            if(newBoard[i] === 'k')  newPieceClasses.push('piece king');
            if(newBoard[i] === 'q')  newPieceClasses.push('piece queen');
            if(newBoard[i] === 'p')  newPieceClasses.push('piece pawn');
            if(newBoard[i] === 'T' || newBoard[i] === 'R')  newPieceClasses.push('piece white rook');
            if(newBoard[i] === 'B') newPieceClasses.push('piece white bishop');
            if(newBoard[i] === 'N') newPieceClasses.push('piece white knight');
            if(newBoard[i] === 'K') newPieceClasses.push('piece white king');
            if(newBoard[i] === 'Q') newPieceClasses.push('piece white queen');
            if(newBoard[i] === 'P') newPieceClasses.push('piece white pawn');
        }
        console.log("setting things");
        // console.log(newPieceClasses);
        setPieceClass(newPieceClasses);
        // console.log(pieceClass());
    }

let className;
  return (
    <div className="chessBoardContainer">
         <div className='chessBoard'>
         <DragDropProvider>
        <DragDropSensors>
        <For each={chessBoard()}>
            {(square, i) => (
                className = `chessSquare`,
                <ChessSquare
                index = {thing++}
                key = {thing+1}
                text = {square}
                chessBoard = {chessBoard}
                className = {`chessSquare ${boardClass()[thing-1]}`}
                setBoardClass = {setBoardClass}
                hoveredElement = {hoveredElement}
                setHovered = {setHovered}
                handleBoardChange = {(newBoard) => handleBoardChange(newBoard) }
                litUpBoxes = {litUpBoxes}
                setLitUpBoxes = {setLitUpBoxes}
                activeItem = {activeItem}
                setActiveItem = {setActiveItem}
                previousMove = {previousMove}
                setPreviousMove = {setPreviousMove}
                pieceClass = {pieceClass}
                setPieceClass = {setPieceClass}

                />
            )}
            </For>
          
            </DragDropSensors>
        </DragDropProvider>
        </div>
        {/* <NewDragNDrop/> */}
    </div>
     
  )
}

export default ChessBoard

  
  function twoStringMatch(X, Y){
    //create algorth that find the commons substring between two 
    let m = X.length;
    let n = Y.length;
  
    let LCSuff = new Array(m+1);
    
  
    let len = 0;
  
    let row = 0, col = 0;
  
    /* Following steps build LCSuff[m+1][n+1] in bottom
       up fashion. */
    for (let i = 0; i <= m; i++) {
        LCSuff[i] = Array(n+1);
        for (let j = 0; j <= n; j++) {
            LCSuff[i][j]=0;   
            if (i === 0 || j === 0)
                LCSuff[i][j] = 0;
  
            else if (X[i-1] === Y[j-1]) {
                LCSuff[i][j] = LCSuff[i - 1][j - 1] + 1;
                if (len < LCSuff[i][j]) {
                    len = LCSuff[i][j];
                    row = i;
                    col = j;
                }
            }
            else
                LCSuff[i][j] = 0;
        }
    }
  
    // if true, then no common substring exists
    if (len === 0) {
        // console.log("No Common Substring");
        return "";
    }
  
    // allocate space for the longest common substring
    let resultStr = "";
  
    // traverse up diagonally form the (row, col) cell
    // until LCSuff[row][col] !== 0
    while (LCSuff[row][col] !== 0) {
        resultStr = X[row-1] + resultStr; // or Y[col-1]
        --len;
  
        // move diagonally up to previous cell
        row--;
        col--;
    }
    // console.log("Common sub:",resultStr.trim());
    return resultStr.trim();
  }
  
  function findRockMoves (chessBoard, index){
    let moves = [];
    let firstOfRow = firstOfRowFunc(index);
    if( chessBoard[index] === 't'){
         chessBoard[index] = 'r';
    }
    if( chessBoard[index] === 'T'){
         chessBoard[index] = 'R';
    }
  
    if( chessBoard[index] === blackRook){
            for(let i=1;i<8;i++){
                if(index-i >= firstOfRow && ( chessBoard[index-i]-0 < COLORDELIMITER ||  chessBoard[index-i] === emptySpace)){
                    moves.push(index);
                    moves.push(-i);
                    if( chessBoard[index-i] !== emptySpace){
                        break;
                    }
                }else{
                    break;
                }
            }
            for(let i=1;i<8;i++){
                if(index+i < firstOfRow+8 && ( chessBoard[index+i]-0 < 91 ||  chessBoard[index+i] === emptySpace)){
                    moves.push(index);
                    moves.push(i);
                    if( chessBoard[index+i] !== emptySpace){
                        break;
                    }
                }else{
                    break;
                }
            }
            for(let i=8;i<57;i=i+8){
                if(index+i <= 63 && ( chessBoard[index+i]-0 < 91 ||  chessBoard[index+i] === emptySpace)){
                    moves.push(index);
                    moves.push(i);
                    if( chessBoard[index+i] !== emptySpace){
                        break;
                    }
                }else{
                    break;
                }
            }
            for(let i=8;i<57;i=i+8){
            //add or subtract 8 to go up or down
                if(index-i >= 0 && ( chessBoard[index-i]-0 < COLORDELIMITER ||  chessBoard[index-i] === emptySpace)){
                    moves.push(index);
                    moves.push(-i);
                    if( chessBoard[index-i] !== emptySpace){
                        break;
                    }
                }else{
                    break;
                }
            }  
    }
    if( chessBoard[index] === whiteRook){
                //left and right moves
        for(let i=1;i<8;i++){
            if(index-i >= firstOfRow && ( chessBoard[index-i]-0 > COLORDELIMITER ||  chessBoard[index-i] === emptySpace)){
                moves.push(index);
                moves.push(-i);
                if( chessBoard[index-i] !== emptySpace){
                    break;
                }
            }else{
                break;
            }
        }
        for(let i=1;i<8;i++){
            if(index+i < firstOfRow+8 && ( chessBoard[index+i]-0 > 91 ||  chessBoard[index+i] === emptySpace)){
                moves.push(index);
                moves.push(i);
                if( chessBoard[index+i] !== emptySpace){
                    break;
                }
            }else{
                break;
            }
        }
        for(let i=8;i<57;i=i+8){
            if(index+i <= 63 && ( chessBoard[index+i]-0 > 91 ||  chessBoard[index+i] === emptySpace)){
                moves.push(index);
                moves.push(i);
                if( chessBoard[index+i] !== emptySpace){
                    break;
                }
            }else{
                break;
            }
        }
        for(let i=8;i<57;i=i+8){
        //add or subtract 8 to go up or down
            if(index-i >= 0 && ( chessBoard[index-i]-0 > 91 ||  chessBoard[index-i] === emptySpace)){
                moves.push(index);
                moves.push(-i);
                if( chessBoard[index-i] !== emptySpace){
                    break;
                }
            }else{
                break;
            }
        }
   
    }
    if(moves.length>0){
      return moves;
    }else{
      return undefined;
    }
    //here we check for moves that remove castling rights, that is the first move.
    //the thing is that castling rights need to be kept track of with the board state, so they should be calculated at the time the move is made,
    //since that is when the new board state is created, all castling rights should therefore be created at the move function where the new board state is created. 
    //so for minimax the move function should take in a board, castlingRigths, and a single move, but the problem is that, the function only return one thing.
    //maybe the board should be an object but that would likely slow things down, or maybe we should combine castling rights, maybe the rocks can be a different, letter
    //when they can castle that seems like the easiest choice, that would not take up any more data, and would allow for the castlingrights to be stored in the
    //board array, so rook right now is represented by R and r, but maybe when they can castle they can be T and t for tower. So, at the begging state,
    //they start out as T, and t but when they move they turn to R and r and also the king will turn it when moving. 
  
  };
  
  //bishops can move and eat now
  function findBishopMoves (chessBoard, index){
  let moves = [];
  
  if( chessBoard[index] === blackBishop){
          //moves down and to the right
      for(let i=9;i<=MAXBOARDINDEX;i=i+9){
          if(index%8 === 7 || index >= 56){ break;}
          if(index+i <= 63 && ( chessBoard[index+i]-0 < 91)){
              // cout << "moved";
              moves.push(index);
              moves.push(i);
              if((index+i)%8 === 7 || index+i>=56 ||  chessBoard[index+i] !== emptySpace){
                  // cout << "Broke at index: " << index+i << "\n\n";
                  break;
              }
          }
          if( chessBoard[index+i] !== emptySpace){
              break;
          }
  
      }
      //moves up and to the the left.
      for(let i=9;i<=MAXBOARDINDEX;i=i+9){
          if(index%8 === 0 || index <= 7){ break;}
          if(index-i <= 63 && ( chessBoard[index-i]-0 < 91)){
              // cout << "moved";
              moves.push(index);
              moves.push(-i);
              if((index-i)%8 === 0 || index-i <= 7 ||  chessBoard[index-i] !== emptySpace){
                  break;
              }
          }
          // cout << " chessBoard[index+i]: " <<  chessBoard[index+i] << "\n\n";
          if( chessBoard[index-i] !== emptySpace){
              break;
          }
      }
      //moves down and to the left
      for(let i=7;i<=MAXBOARDINDEX;i=i+7){
          //down and to the right needs to exit when on the left or down
          if(index%8 === 0 || index >= 56){ break;}
          if(index+i <= 63 && ( chessBoard[index+i]-0 < 91)){
              // cout << "moved";
              moves.push(index);
              moves.push(i);
              if((index+i)%8 === 0 || index+i>=56 ||  chessBoard[index+i] !== emptySpace){
                  break;
              }
          }
          if( chessBoard[index+i] !== emptySpace){
              break;
          }
      }
      // move up and to the right;
      for(let i=7;i<=MAXBOARDINDEX;i=i+7){
          if(index%8 === 7 || index <= 7){ break;}
          if(index-i <= 63 && ( chessBoard[index-i]-0 < 91)){
              moves.push(index);
              moves.push(-i);
              if((index-i)%8 === 7 || index+i <= 7 ||  chessBoard[index-i] !== emptySpace){
                  break;
              }
          }
          if( chessBoard[index-i] !== emptySpace){
              break;
          }
      } 
  }
  
  if( chessBoard[index] === whiteBishop){
      //moves down and to the right
      for(let i=9;i<=63;i=i+9){
          if(index%8 === 7 || index >= 56){ break;}
          if(index+i <= 63 && ( chessBoard[index+i]-0 > 91)){
              // cout << "moved";
              moves.push(index);
              moves.push(i);
              if((index+i)%8 === 7 || index+i>=56 ||  chessBoard[index+i] !== emptySpace){
                  // cout << "Broke at index: " << index+i << "\n\n";
                  break;
              }
          }
          if( chessBoard[index+i] !== emptySpace){
              break;
          }
      }
      //moves up and to the the left.
      for(let i=9;i<=63;i=i+9){
          if(index%8 === 0 || index <= 7){ break;}
          if(index-i <= 63 && ( chessBoard[index-i]-0 > 91)){
              // cout << "moved";
              moves.push(index);
              moves.push(-i);
              if((index-i)%8 === 0 || index-i <= 7 ||  chessBoard[index-i] !== emptySpace){
                  break;
              }
          }
          if( chessBoard[index-i] !== emptySpace){
              break;
          }
      }
      //moves down and to the left
      for(let i=7;i<=63;i=i+7){
          //down and to the right needs to exit when on the left or down
          if(index%8 === 0 || index >= 56){ break;}
          if(index+i <= 63 && ( chessBoard[index+i]-0 > 91)){
              // cout << "moved";
              moves.push(index);
              moves.push(i);
              if((index+i)%8 === 0 || index+i>=56 ||  chessBoard[index+i] !== emptySpace){
                  break;
              }
          }
          if( chessBoard[index+i] !== emptySpace){
              break;
          }
      }
      // move up and to the right;
      for(let i=7;i<=63;i=i+7){
          if(index%8 === 7 || index <= 7){ break;}
          if(index-i <= 63 && ( chessBoard[index-i]-0 > 91)){
              moves.push(index);
              moves.push(-i);
              if((index-i)%8 === 7 || index+i <= 7 ||  chessBoard[index-i] !== emptySpace){
                  break;
              }
          }
          if( chessBoard[index-i] !== emptySpace){
              break;
          }
      } 
  }
  return moves;
  }
  
  //horse can move and eat now
  function findHorseMoves( chessBoard, index){
  
    let moves = [];
    
    
    if( chessBoard[index] === blackKnight){
        //UP AND LEFT
            // cout << "index: " << index << "\n\n";
            // cout << " chessBoard[index]: " <<  chessBoard[index] << "\n\n";
        if(index >= TWOROWSFROMTOP && index%ROWZISE !== LEFTCOLUMN &&( chessBoard[index+KUPLEFT] === emptySpace ||  chessBoard[index+KUPLEFT]-0 < COLORDELIMITER )){
            moves.push(index);
            moves.push(KUPLEFT);
        }
        //UP AND RIGHT
        if(index >= TWOROWSFROMTOP && index%ROWZISE !== RIGHTCOLUMN &&( chessBoard[index+KUPRIGHT] === emptySpace ||  chessBoard[index+KUPRIGHT]-0 < COLORDELIMITER )){
            moves.push(index);
            moves.push(KUPRIGHT);
        }
        //DOWN AND LEFT
        if(index < TWOROWFROMBOTTOM && index%ROWZISE !== LEFTCOLUMN &&( chessBoard[index+KDOWNLEFT] === emptySpace ||  chessBoard[index+KDOWNLEFT]-0 < COLORDELIMITER )){
            // console.log(moves);
            moves.push(index);
            moves.push(KDOWNLEFT);
        }
        //DOWN AND RIGHT
        if(index < TWOROWFROMBOTTOM && index%ROWZISE !== RIGHTCOLUMN &&( chessBoard[index+KDOWNRIGHT] === emptySpace ||  chessBoard[index+KDOWNRIGHT]-0 < COLORDELIMITER )){
            moves.push(index);
            moves.push(KDOWNRIGHT);
        }
        
        //LEFT AND UP
        if(index >= ONEROWFROMTOP && (index%ROWZISE !==LEFTCOLUMN && index%ROWZISE !== ONEFROMLEFT) &&( chessBoard[index+KLEFTUP] === emptySpace ||  chessBoard[index+KLEFTUP]-0 < COLORDELIMITER )){
            moves.push(index);
            moves.push(KLEFTUP);
        }
        //LEFT AND DOWN
        if(index < ONEROWFROMBOTTOM && (index%ROWZISE !==LEFTCOLUMN && index%ROWZISE !== ONEFROMLEFT) &&( chessBoard[index+KLEFTDOWN] === emptySpace ||  chessBoard[index+KLEFTDOWN]-0 < COLORDELIMITER )){
            moves.push(index);
            moves.push(KLEFTDOWN);
        }
        //RIGHT AND UP
        if(index >= ONEROWFROMTOP && index%ROWZISE !==RIGHTCOLUMN && index%ROWZISE !== ONEFROMRIGHT &&( chessBoard[index+KRIGHTUP] === emptySpace ||  chessBoard[index+KRIGHTUP]-0 < COLORDELIMITER )){
            moves.push(index);
            moves.push(KRIGHTUP);
        }
        //RIGHT AND DOWN
        if(index < ONEROWFROMBOTTOM && index%ROWZISE !==RIGHTCOLUMN && index%ROWZISE !== ONEFROMRIGHT &&( chessBoard[index+KIRGHTDOWN] === emptySpace ||  chessBoard[index+KIRGHTDOWN]-0 < COLORDELIMITER )){
            moves.push(index);
            moves.push(KIRGHTDOWN);
        }
    }
    if( chessBoard[index] === whiteKnight){
              //UP AND LEFT
          // cout << "index: " << index << "\n\n";
          // cout << " chessBoard[index]: " <<  chessBoard[index] << "\n\n";
      if(index >= TWOROWSFROMTOP && index%ROWZISE !== LEFTCOLUMN &&( chessBoard[index+KUPLEFT] === emptySpace ||  chessBoard[index+KUPLEFT]-0 > COLORDELIMITER )){
          moves.push(index);
          moves.push(KUPLEFT);
      }
      //UP AND RIGHT
      if(index >= TWOROWSFROMTOP && index%ROWZISE !== RIGHTCOLUMN &&( chessBoard[index+KUPRIGHT] === emptySpace ||  chessBoard[index+KUPRIGHT]-0 > COLORDELIMITER )){
          moves.push(index);
          moves.push(KUPRIGHT);
      }
      //DOWN AND LEFT
      if(index < TWOROWFROMBOTTOM && index%ROWZISE !== LEFTCOLUMN &&( chessBoard[index+KDOWNLEFT] === emptySpace ||  chessBoard[index+KDOWNLEFT]-0 > COLORDELIMITER )){
          moves.push(index);
          moves.push(KDOWNLEFT);
      }
      //DOWN AND RIGHT
      if(index < TWOROWFROMBOTTOM && index%ROWZISE !== RIGHTCOLUMN &&( chessBoard[index+KDOWNRIGHT] === emptySpace ||  chessBoard[index+KDOWNRIGHT]-0 > COLORDELIMITER )){
          moves.push(index);
          moves.push(KDOWNRIGHT);
      }
      
      //LEFT AND UP
      if(index >= ONEROWFROMTOP && (index%ROWZISE !==LEFTCOLUMN && index%ROWZISE !== ONEFROMLEFT) &&( chessBoard[index+KLEFTUP] === emptySpace ||  chessBoard[index+KLEFTUP]-0 > COLORDELIMITER )){
          moves.push(index);
          moves.push(KLEFTUP);
      }
      //LEFT AND DOWN
      if(index < ONEROWFROMBOTTOM && (index%ROWZISE !==LEFTCOLUMN && index%ROWZISE !== ONEFROMLEFT) &&( chessBoard[index+KLEFTDOWN] === emptySpace ||  chessBoard[index+KLEFTDOWN]-0 > COLORDELIMITER )){
          moves.push(index);
          moves.push(KLEFTDOWN);
      }
      //RIGHT AND UP
      if(index >= ONEROWFROMTOP && index%ROWZISE !==RIGHTCOLUMN && index%ROWZISE !== ONEFROMRIGHT &&( chessBoard[index+KRIGHTUP] === emptySpace ||  chessBoard[index+KRIGHTUP]-0 > COLORDELIMITER )){
          moves.push(index);
          moves.push(KRIGHTUP);
      }
      //RIGHT AND DOWN
      if(index < ONEROWFROMBOTTOM && index%ROWZISE !==RIGHTCOLUMN && index%ROWZISE !== ONEFROMRIGHT &&( chessBoard[index+KIRGHTDOWN] === emptySpace ||  chessBoard[index+KIRGHTDOWN]-0 > COLORDELIMITER )){
          moves.push(index);
          moves.push(KIRGHTDOWN);
      } 
  }
  return moves;
  
  }
  
  //queen knows to eat
  function findQueenMoves( chessBoard, index){
  let moves = [];
  let firstOfRow = firstOfRowFunc(index);
  if( chessBoard[index] === blackQueen){
       //left and right moves
      for(let i=1;i<8;i++){
          if(index-i >= firstOfRow && ( chessBoard[index-i]-0 < COLORDELIMITER ||  chessBoard[index-i] === emptySpace)){
              moves.push(index);
              moves.push(-i);
              if( chessBoard[index-i] !== emptySpace){
                  break;
              }
          }else{
              break;
          }
      }
      for(let i=1;i<8;i++){
          if(index+i < firstOfRow+8 && ( chessBoard[index+i]-0 < 91 ||  chessBoard[index+i] === emptySpace)){
              moves.push(index);
              moves.push(i);
              if( chessBoard[index+i] !== emptySpace){
                  break;
              }
          }else{
              break;
          }
      }
      for(let i=8;i<57;i=i+8){
          if(index+i <= 63 && ( chessBoard[index+i]-0 < 91 ||  chessBoard[index+i] === emptySpace)){
              moves.push(index);
              moves.push(i);
              if( chessBoard[index+i] !== emptySpace){
                  break;
              }
          }else{
              break;
          }
      }
      for(let i=8;i<57;i=i+8){
      //add or subtract 8 to go up or down
          if(index-i >= 0 && ( chessBoard[index-i]-0 < COLORDELIMITER ||  chessBoard[index-i] === emptySpace)){
              moves.push(index);
              moves.push(-i);
              if( chessBoard[index-i] !== emptySpace){
                  break;
              }
          }else{
              break;
          }
      }
  
        //moves down and to the right
      for(let i=9;i<=MAXBOARDINDEX;i=i+9){
          if(index%8 === 7 || index >= 56){ break;}
          if(index+i <= 63 && ( chessBoard[index+i]-0 < 91)){
              // cout << "moved";
              moves.push(index);
              moves.push(i);
              if((index+i)%8 === 7 || index+i>=56 ||  chessBoard[index+i] !== emptySpace){
                  // cout << "Broke at index: " << index+i << "\n\n";
                  break;
              }
          }
          if( chessBoard[index+i] !== emptySpace){
              break;
          }
  
      }
      //moves up and to the the left.
      for(let i=9;i<=MAXBOARDINDEX;i=i+9){
          if(index%8 === 0 || index <= 7){ break;}
          if(index-i <= 63 && ( chessBoard[index-i]-0 < 91)){
              // cout << "moved";
              moves.push(index);
              moves.push(-i);
              if((index-i)%8 === 0 || index-i <= 7 ||  chessBoard[index-i] !== emptySpace){
                  break;
              }
          }
          if( chessBoard[index-i] !== emptySpace){
              break;
          }
      }
      //moves down and to the left
      for(let i=7;i<=MAXBOARDINDEX;i=i+7){
          //down and to the right needs to exit when on the left or down
          if(index%8 === 0 || index >= 56){ break;}
          if(index+i <= 63 && ( chessBoard[index+i]-0 < 91)){
              // cout << "moved";
              moves.push(index);
              moves.push(i);
              if((index+i)%8 === 0 || index+i>=56 ||  chessBoard[index+i] !== emptySpace){
                  break;
              }
          }
          if( chessBoard[index+i] !== emptySpace){
              break;
          }
      }
      // move up and to the right;
      for(let i=7;i<=MAXBOARDINDEX;i=i+7){
          if(index%8 === 7 || index <= 7){ break;}
          if(index-i <= 63 && ( chessBoard[index-i]-0 < 91)){
              moves.push(index);
              moves.push(-i);
              if((index-i)%8 === 7 || index+i <= 7 ||  chessBoard[index-i] !== emptySpace){
                  break;
              }
          }
          if( chessBoard[index-i] !== emptySpace){
              break;
          }
      } 
  }
  if( chessBoard[index] === whiteQueen){
       //left and right moves
      for(let i=1;i<8;i++){
          if(index-i >= firstOfRow && ( chessBoard[index-i]-0 > COLORDELIMITER ||  chessBoard[index-i] === emptySpace)){
              moves.push(index);
              moves.push(-i);
              if( chessBoard[index-i] !== emptySpace){
                  break;
              }
          }else{
              break;
          }
      }
      for(let i=1;i<8;i++){
          if(index+i < firstOfRow+8 && ( chessBoard[index+i]-0 > 91 ||  chessBoard[index+i] === emptySpace)){
              moves.push(index);
              moves.push(i);
              if( chessBoard[index+i] !== emptySpace){
                  break;
              }
          }else{
              break;
          }
      }
      for(let i=8;i<57;i=i+8){
          if(index+i <= 63 && ( chessBoard[index+i]-0 > 91 ||  chessBoard[index+i] === emptySpace)){
              moves.push(index);
              moves.push(i);
              if( chessBoard[index+i] !== emptySpace){
                  break;
              }
          }else{
              break;
          }
      }
      for(let i=8;i<57;i=i+8){
      //add or subtract 8 to go up or down
          if(index-i >= 0 && ( chessBoard[index-i]-0 > 91 ||  chessBoard[index-i] === emptySpace)){
              moves.push(index);
              moves.push(-i);
              if( chessBoard[index-i] !== emptySpace){
                  break;
              }
          }else{
              break;
          }
      }
  
     //moves down and to the right
      for(let i=9;i<=63;i=i+9){
          if(index%8 === 7 || index >= 56){ break;}
          if(index+i <= 63 && ( chessBoard[index+i]-0 > 91)){
              // cout << "moved";
              moves.push(index);
              moves.push(i);
              if((index+i)%8 === 7 || index+i>=56 ||  chessBoard[index+i] !== emptySpace){
                  // cout << "Broke at index: " << index+i << "\n\n";
                  break;
              }
          }
          if( chessBoard[index+i] !== emptySpace){
              break;
          }
      }
      //moves up and to the the left.
      for(let i=9;i<=63;i=i+9){
          if(index%8 === 0 || index <= 7){ break;}
          if(index-i <= 63 && ( chessBoard[index-i]-0 > 91)){
              // cout << "moved";
              moves.push(index);
              moves.push(-i);
              if((index-i)%8 === 0 || index-i <= 7 ||  chessBoard[index-i] !== emptySpace){
                  break;
              }
          }
          if( chessBoard[index-i] !== emptySpace){
              break;
          }
      }
      //moves down and to the left
      for(let i=7;i<=63;i=i+7){
          //down and to the right needs to exit when on the left or down
          if(index%8 === 0 || index >= 56){ break;}
          if(index+i <= 63 && ( chessBoard[index+i]-0 > 91)){
              // cout << "moved";
              moves.push(index);
              moves.push(i);
              if((index+i)%8 === 0 || index+i>=56 ||  chessBoard[index+i] !== emptySpace){
                  break;
              }
          }
          if( chessBoard[index+i] !== emptySpace){
              break;
          }
      }
      // move up and to the right;
      for(let i=7;i<=63;i=i+7){
          if(index%8 === 7 || index <= 7){ break;}
          if(index-i <= 63 && ( chessBoard[index-i]-0 > 91)){
              moves.push(index);
              moves.push(-i);
              if((index-i)%8 === 7 || index+i <= 7 ||  chessBoard[index-i] !== emptySpace){
                  break;
              }
          }
          if( chessBoard[index-i] !== emptySpace){
              break;
          }
      } 
    
  }
  return moves;
  }
  //king knows to eat - needs to learn castling
  function findKingMoves( chessBoard,index){
  let moves = [];
  
  let firstOfRow = firstOfRowFunc(index);
  
  
  if( chessBoard[index] === blackKing && blackKingHasMoved === false){
      if( chessBoard[0] === 't'){
          // moves.push()
      }
      if( chessBoard[7] === 't'){
  
      }
      blackKingHasMoved = true;
      for(let i=0;i< chessBoard.length; i++){
          if( chessBoard[i] === 't'){
               chessBoard[i] ='r';
          }
      }
    }
  
    if( chessBoard[index] === whiteKing && whiteKingHasMoved === false){
        whiteKingHasMoved = true;
        for(let i=0;i< chessBoard.length; i++){
            if( chessBoard[i] === 'T'){
                 chessBoard[i] ='R';
            }
        }
    }
  
    if( chessBoard[index] === blackKing){
    // cout << "made it";
    // cout <<  chessBoard[index+7]-0;
    if((index+left >= firstOfRow )&& (( chessBoard[index+left]-CHAR)).charCodeAt() < COLORDELIMITER ||  chessBoard[index+left] === emptySpace){
                moves.push(index);
                moves.push(left);
    }
    if((index+right < firstOfRow+ROWZISE )&& (( chessBoard[index+right]-CHAR)).charCodeAt() < COLORDELIMITER ||  chessBoard[index+right] === emptySpace){
                moves.push(index);
                moves.push(right);
    }
    if((index+spaceDown <= MAXBOARDINDEX )&& (( chessBoard[index+spaceDown]-CHAR)).charCodeAt() < COLORDELIMITER ||  chessBoard[index+spaceDown] === emptySpace){
                moves.push(index);
                moves.push(spaceDown);
    }
    if((index+spaceUp >= 0 ) && (( chessBoard[index+spaceUp]-CHAR)).charCodeAt() < COLORDELIMITER ||  chessBoard[index+spaceUp] === emptySpace){
                moves.push(index);
                moves.push(spaceUp);
    }
  
  
    if((index+rightDown <= MAXBOARDINDEX  && (index%ROWZISE !== RIGHTCOLUMN && index < MAXBOARDINDEX ))&&(( chessBoard[index+rightDown]-CHAR)).charCodeAt() < COLORDELIMITER ||  chessBoard[index+rightDown] === emptySpace){
        moves.push(index);
        moves.push(rightDown);
    }
    if((index+leftUp <= MAXBOARDINDEX && (index%ROWZISE !== LEFTCOLUMN && index >= ONEROWFROMTOP  ))&&(( chessBoard[index+leftUp]-CHAR)).charCodeAt() < COLORDELIMITER ||  chessBoard[index+leftUp] === emptySpace){
        moves.push(index);
        moves.push(leftUp);
    }
    if((index+leftDown <= MAXBOARDINDEX  && (index%ROWZISE !== LEFTCOLUMN && index < MAXBOARDINDEX )) && (( chessBoard[index+leftDown]-CHAR)).charCodeAt() < COLORDELIMITER ||  chessBoard[index+leftDown] === emptySpace){
        moves.push(index);
        moves.push(leftDown);
    }
    if((index+rightUp <= MAXBOARDINDEX &&  (index%ROWZISE !== RIGHTCOLUMN && index >= ONEROWFROMTOP  )) && (( chessBoard[index+rightUp]-CHAR)).charCodeAt() < COLORDELIMITER ||  chessBoard[index+rightUp] === emptySpace){
        moves.push(index);
        moves.push(rightUp);
    }
  
    }
    if( chessBoard[index] === whiteKing){
    // cout << "made it";
    // cout <<  chessBoard[index+7]-0;
    if((index+left >= firstOfRow )&& (( chessBoard[index+left]-CHAR)).charCodeAt() > COLORDELIMITER ||  chessBoard[index+left] === emptySpace){
                moves.push(index);
                moves.push(left);
    }
    if((index+right < firstOfRow+ROWZISE )&& (( chessBoard[index+right]-CHAR)).charCodeAt() > COLORDELIMITER ||  chessBoard[index+right] === emptySpace){
                moves.push(index);
                moves.push(right);
    }
    if((index+spaceDown <= MAXBOARDINDEX )&& (( chessBoard[index+spaceDown]-CHAR)).charCodeAt() > COLORDELIMITER ||  chessBoard[index+spaceDown] === emptySpace){
                moves.push(index);
                moves.push(spaceDown);
    }
    if((index+spaceUp >= 0 ) && (( chessBoard[index+spaceUp]-CHAR)).charCodeAt() > COLORDELIMITER ||  chessBoard[index+spaceUp] === emptySpace){
                moves.push(index);
                moves.push(spaceUp);
    }
  
    if((index+rightDown <= MAXBOARDINDEX  && (index%ROWZISE !== RIGHTCOLUMN && index < MAXBOARDINDEX ))&&(( chessBoard[index+rightDown]-CHAR)).charCodeAt() > COLORDELIMITER ||  chessBoard[index+rightDown] === emptySpace){
        moves.push(index);
        moves.push(rightDown);
    }
    if((index+leftUp <= MAXBOARDINDEX && (index%ROWZISE !== LEFTCOLUMN && index > ONEROWFROMTOP  ))&&(( chessBoard[index+leftUp]-CHAR)).charCodeAt() > COLORDELIMITER ||  chessBoard[index+leftUp] === emptySpace){
        moves.push(index);
        moves.push(leftUp);
    }
    if((index+leftDown <= MAXBOARDINDEX  && (index%ROWZISE !== LEFTCOLUMN && index < MAXBOARDINDEX )) && (( chessBoard[index+leftDown]-CHAR)).charCodeAt() > COLORDELIMITER ||  chessBoard[index+leftDown] === emptySpace){
        moves.push(index);
        moves.push(leftDown);
    }
    if((index+rightUp <= MAXBOARDINDEX &&  (index%ROWZISE !== RIGHTCOLUMN && index > ONEROWFROMTOP  )) && (( chessBoard[index+rightUp]-CHAR)).charCodeAt() > COLORDELIMITER ||  chessBoard[index+rightUp] === emptySpace){
        moves.push(index);
        moves.push(rightUp);
    }
  
  }
  return moves;
    
  }
  //pawns know to eat- need to leart em-peassant or whatever
  function findPawnMoves( chessBoard, index, previousMove ){
  let moves = [];
  //pawsns know everything except how to do en-paissant.
  //pawns can only do on-passent when directly adjacent
  //pawns can only do en paessant if, they a pawn jumps directly next to them
  //by doing a double pawn move, this seems difficult to track. 
  //In order to be able to keep track of em-passent, I need to pay attention to pawsn that are on the 5th
  //then we keep track of previous move, and check if the there is pawns from the opposite team next to it.
  //then if the previous move was that exact double pawn move, then we add on-passant is possible.` `
  
  //for black pawns we need to check if the pawn is between the numbers 
  // chessBoard[index] >= 32 && <= 39;
  //and then check if index plus or minus one has a pawn,
  //and then check if the previous move is from one of the pawns,
  //and the also check if the pawn moved either -16, or 16 in the previous move.
  //if all of these are true then we use on-passant, which is a diagonal movement, but we eat the pawn,
  //that is next to us.  
  if( chessBoard[index] === blackPawn && index < ONEROWFROMBOTTOM){
      if( chessBoard[index+spaceDown] === emptySpace){
          moves.push(index);
          moves.push(spaceDown);
      }
      if(index >=32 && index <= 39){
          if( chessBoard[index+right] === whitePawn){
              if(previousMove[0]+previousMove[1] === index+1 && previousMove[1] === -16){
                  moves.push(index);
                  moves.push(rightDown);
              }
          }
          if( chessBoard[index+left] === whitePawn){
              if(previousMove[0]+previousMove[1] === index+1 && previousMove[1] === -16){
                  moves.push(index);
                  moves.push(leftDown);
              }
          }
      }
  
      if( chessBoard[index+rightDown] !== emptySpace &&  chessBoard[index+rightDown]-0 < COLORDELIMITER){
          moves.push(index);
          moves.push(rightDown);
      }
      if( chessBoard[index+leftDown] !== emptySpace &&  chessBoard[index+leftDown]-0 < COLORDELIMITER){
          moves.push(index);
          moves.push(leftDown);
      }
      if(index <= 15 && index >= 8 &&  chessBoard[index+(spaceDown*2)] === emptySpace){
          moves.push(index);
          moves.push(spaceDown*2);
      }
  }
  if( chessBoard[index] === whitePawn && index >= ONEROWFROMTOP){
      if( chessBoard[index+spaceUp] === emptySpace){
          moves.push(index);
          moves.push(spaceUp);
      }
      //for the white pawns it is different numbers
     
  
       if(index >=24 && index <= 31){
              //  cout << "made it  "<< index << " " << index+left << "\n\n";
          if( chessBoard[index+right] === blackPawn){
              if(previousMove[0]+previousMove[1] === index+right && previousMove[1] === -16){
                  moves.push(index);
                  moves.push(rightUp);
              }
          }
          if( chessBoard[index+left] === blackPawn){
              if(previousMove[0]+previousMove[1] === index+left && previousMove[1] === 16){
                  moves.push(index);
                  moves.push(leftUp);
              }
          }
      }
  
      if( chessBoard[index+rightUp] !== emptySpace &&  chessBoard[index+rightUp]-0 > COLORDELIMITER){
          moves.push(index);
          moves.push(rightUp);
      }
      if( chessBoard[index+leftUp] !== emptySpace &&  chessBoard[index+leftUp]-0 > COLORDELIMITER){
          moves.push(index);
          moves.push(leftUp);
      }
      if(index <= 55 && index >= 48 &&  chessBoard[index+(spaceUp*2)] === emptySpace){
          moves.push(index);
          moves.push(spaceUp*2);
      }
  }
  
  return moves;
  }
  
  function firstOfRowFunc(index){
  if(index>=56) return 56;
  if(index>=48) return 48;
  if(index>=32) return 32;
  if(index>=24) return 24;
  if(index>=16) return 16;
  if(index>=8) return 8;
  return 0;
  }