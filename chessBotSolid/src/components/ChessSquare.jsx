import {
    DragDropProvider,
    DragDropSensors,
    useDragDropContext,
    createDraggable,
    createDroppable,
    DragOverlay
  } from "@thisbeyond/solid-dnd";
  import { createSignal } from "solid-js";

const  emptySpace = '-';
const  whiteRook = 'R';
const  whiteKnight = 'N';
const  whiteBishop = 'B';
const  whiteQueen = 'Q';
const  whiteKing = 'K';
const  whitePawn = 'P';
const  blackRook = 'r';
const  blackKnight = 'n';
const  blackBishop = 'b';
const  blackQueen = 'q';
const  blackKing = 'k';
const  blackPawn = 'p';
const  spaceUp = -8;
const  spaceDown = 8;
const  left = -1;
const  right = 1;
const  leftUp = -9;
const  rightUp = -7;
const  leftDown = 7;
const  rightDown = 9;
const  COLORDELIMITER = 91;

//horse constants;
const  KUPLEFT = -17;
const  KUPRIGHT = -15;
const  KDOWNLEFT = 15;
const  KDOWNRIGHT = 17;
const  KLEFTUP = -10;
const  KLEFTDOWN = 6;
const  KRIGHTUP = -6;
const  KIRGHTDOWN = 10;

const  ROWZISE = 8;
const  LEFTCOLUMN = 0;
const  ONEFROMLEFT = 1;
const  RIGHTCOLUMN = 7;
const  ONEFROMRIGHT = 6;
const  TWOROWSFROMTOP = 16;
const  ONEROWFROMTOP = 8;
const  ONEROWFROMBOTTOM = 56;
const  TWOROWFROMBOTTOM = 48;
const  MAXBOARDINDEX = 63;
const  CHAR = 0;

let whiteKingHasMoved = false;
let blackKingHasMoved = false;






function ChessSquare({text, className, chessBoard, index, hoveredElement, setHovered, key, handleBoardChange, litUpBoxes, setLitUpBoxes, activeItem, setActiveItem}) {


    const [pieceClass, setPieceClass] = createSignal('-');
   

    const [previousMove, setPreviousMove] = createSignal([69,69]);
    if(chessBoard()[index] === '-') setPieceClass('-'); 
    if(chessBoard()[index] === 't' || text === 'r'){setPieceClass('piece rook');}
    if(chessBoard()[index] === 'b')  setPieceClass('piece bishop');
    if(chessBoard()[index] === 'n')  setPieceClass('piece knight');
    if(chessBoard()[index] === 'k')  setPieceClass('piece king');
    if(chessBoard()[index] === 'q')  setPieceClass('piece queen');
    if(chessBoard()[index] === 'p')  setPieceClass('piece pawn');
    if(chessBoard()[index] === 'T' || text === 'R')  setPieceClass('piece white rook');
    if(chessBoard()[index] === 'B') setPieceClass('piece white bishop');
    if(chessBoard()[index] === 'N') setPieceClass('piece white knight');
    if(chessBoard()[index] === 'K') setPieceClass('piece white king');
    if(chessBoard()[index] === 'Q') setPieceClass('piece white queen');
    if(chessBoard()[index] === 'P') setPieceClass('piece white pawn');

    function findPieceMoves(index) {
        let moves = [];
    
          if(chessBoard()[index] === blackRook || chessBoard()[index] === whiteRook || chessBoard()[index] === 'T' || chessBoard()[index] === 't'){
            let rookMoves = findRockMoves(chessBoard(), index);
            if(rookMoves != undefined)
              if(rookMoves.length>0)
                moves.push(...rookMoves);   
    
            
          }
          //biship moves
          if(chessBoard()[index] === blackBishop || chessBoard()[index] === whiteBishop){
              moves.push(...findBishopMoves(chessBoard(), index));
          }
          //knight moves
          if(chessBoard()[index] === blackKnight || chessBoard()[index] === whiteKnight){
              moves.push(...findHorseMoves(chessBoard(), index));
          }
          //queen moves
          if(chessBoard()[index] === blackQueen || chessBoard()[index] === whiteQueen){
              moves.push(...findQueenMoves(chessBoard(), index));
          }
          //king moves
          if(chessBoard()[index] === blackKing || chessBoard()[index] === whiteKing){
              moves.push(...findKingMoves(chessBoard(), index, moves ));
          }
          if(chessBoard()[index] === blackPawn || chessBoard()[index] === whitePawn){
              moves.push(...findPawnMoves(chessBoard(), index, moves, previousMove));
          }
        moves = moves.filter((move) => {
           if(move != undefined){
            return move;
         };
        });
    
    console.log(chessBoard()[index]);
    console.log("moves", moves);
    if(moves.length >0){
        let newBoxes = litUpBoxes();
       
    
        for(let i=0;i<moves.length;i=i+2){
            if(moves[i] != undefined && moves[i+1] != undefined){
            newBoxes[moves[i]+moves[i+1]] = 'circle';
            }
        }
        setLitUpBoxes(newBoxes);
    }
          
       
    
      }

    const Draggable = ({id, index, className, pieceClass}) => {
        const droppable = createDroppable(id);
        const draggable = createDraggable(id);
        const [,{onDragEnd, onDragStart, activeDraggable }] = useDragDropContext();
        // console.log(index);
        onDragEnd(({draggable}) => {
            // console.log("drop",activeItem());
            // console.log("hovered", hoveredElement());
            if(index === hoveredElement() && activeItem() != null){
             
                // console.log("hovered", hoveredElement())
                // console.log("index", activeItem().getAttribute('index')-0);
                let newClass = activeItem().getAttribute('class');
                let newchessBoard = chessBoard();
                // console.log("hovered",newChessBoad[hoveredElement()]);
                // console.log("drop", newChessBoad[activeItem().getAttribute('index')-0] )
                newchessBoard[hoveredElement()] = newchessBoard[activeItem().getAttribute('index')-0];
                if(activeItem().getAttribute('index')-0 != hoveredElement()){
                    newchessBoard[activeItem().getAttribute('index')-0] = '-';
                }
               

                console.log(newchessBoard);
                handleBoardChange(newchessBoard);
                // console.log(chessBoard());
                // console.log(chessBoard());
                setPieceClass(newClass);
                setPreviousMove([activeItem().getAttribute('index')-0,hoveredElement()-activeItem().getAttribute('index')]);
            
            }

            if(index === activeItem().getAttribute('index')-0 && activeItem().getAttribute('index') != hoveredElement()){
                setPieceClass('-')
            }

         setLitUpBoxes(['-','-','-','-','-','-','-','-',
                        '-','-','-','-','-','-','-','-',
                        '-','-','-','-','-','-','-','-',
                        '-','-','-','-','-','-','-','-',
                        '-','-','-','-','-','-','-','-',
                        '-','-','-','-','-','-','-','-',
                        '-','-','-','-','-','-','-','-',
                        '-','-','-','-','-','-','-','-']);
           
        });
    
        onDragStart(({draggable}) => {
        //    console.log(litUpBoxes());
     

           
           if(index === draggable.node.getAttribute('index')-0){
                setActiveItem(draggable.node);
                findPieceMoves(index);
               
           }
           
          
            // console.log(droppable)
        });
        const activeClass = () => {
            let returnClass = '-';
          


        //    console.log(droppable());
            if(litUpBoxes()[index] === 'active'){
                console.log("index",index);
            }
                   
            if(droppable.isActiveDroppable){
                // console.log("active",activeItem().getAttribute('index'));
                setHovered(index);
            
               
                // console.log(index)
                returnClass += ' hovered'
                return returnClass;
            }else{
                return returnClass;
            }
        }
        return(
            <div
                class={`${className} ${activeClass()}` }
                index = {index}
                text = {text}
                use:droppable
                >
                    <section 
                    use:draggable
                    class = {`${pieceClass()}`}
                    index = {index}
                    >
                        <div class = {`${litUpBoxes()[index]}`}></div>
                    </section>
            </div>
        );
       
      };

    
 
    // if(className !== undefined)  pieceClass += className;
  return (
   
        <Draggable
                index = {index}
                id = {key}
                className = {`${className} ${litUpBoxes()[index]}`}
                pieceClass = {pieceClass}
                />

  
  )
}

export default ChessSquare




function addClass(previousClass, newClass) {
    // console.log(object.className)
    if(twoStringMatch(newClass, previousClass).length < newClass.length){
      let returnString = `${previousClass} ${newClass}`;
      return returnString;
    }else{
      return previousClass;
    }
    
  }
  
  function removeClass(previousClass, oldClass) {
    if(twoStringMatch(oldClass, previousClass).length === oldClass.length){
      let newClass = previousClass.replace(oldClass, "").trim();
      return newClass;
    }else{
      return previousClass;
    }
  }
  
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
         for(let i=9;i<=63;i=i+9){
            if(index%8 === 7 || index >= 56){ break;}
            if(index+i <= 63 && ( chessBoard[index+i].charCodeAt() < 91 || chessBoard[index-i] === emptySpace)){
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
            if(index-i <= 63 && ( chessBoard[index-i].charCodeAt() < 91 || chessBoard[index-i] === emptySpace)){
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
            if(index+i <= 63 && ( chessBoard[index+i].charCodeAt()  < 91 || chessBoard[index+i] === emptySpace)){
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
        //example has index 8;
        for(let i=7;i<=63;i=i+7){
           
            if(index%8 === 7 || index <= 7 || index-i < 0){ break;}
            if(index-i <= 63 && ( chessBoard[index-i].charCodeAt() < 91 || chessBoard[index-i] === emptySpace)){
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
            if(index+i <= 63 && ( chessBoard[index+i].charCodeAt() > 91 || chessBoard[index+i] === emptySpace)){
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
            if(index-i <= 63 && ( chessBoard[index-i].charCodeAt() > 91 || chessBoard[index-i] === emptySpace)){
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
            if(index+i <= 63 && ( chessBoard[index+i].charCodeAt() > 91 || chessBoard[index+i] === emptySpace)){
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
           
            if(index%8 === 7 || index <= 7 || index-i < 0){ break;}
            if(index-i <= 63 && ( chessBoard[index-i].charCodeAt() < 91 || chessBoard[index-i] === emptySpace)){
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
        if(index >= TWOROWSFROMTOP && index%ROWZISE !== LEFTCOLUMN &&( chessBoard[index+KUPLEFT] === emptySpace ||  chessBoard[index+KUPLEFT].charCodeAt() < COLORDELIMITER )){
            moves.push(index);
            moves.push(KUPLEFT);
        }
        //UP AND RIGHT
        if(index >= TWOROWSFROMTOP && index%ROWZISE !== RIGHTCOLUMN &&( chessBoard[index+KUPRIGHT] === emptySpace ||  chessBoard[index+KUPRIGHT].charCodeAt() < COLORDELIMITER )){
            moves.push(index);
            moves.push(KUPRIGHT);
        }
        //DOWN AND LEFT
        if(index < TWOROWFROMBOTTOM && index%ROWZISE !== LEFTCOLUMN &&( chessBoard[index+KDOWNLEFT] === emptySpace ||  chessBoard[index+KDOWNLEFT].charCodeAt() < COLORDELIMITER )){
            // console.log(moves);
            moves.push(index);
            moves.push(KDOWNLEFT);
        }
        //DOWN AND RIGHT
        if(index < TWOROWFROMBOTTOM && index%ROWZISE !== RIGHTCOLUMN &&( chessBoard[index+KDOWNRIGHT] === emptySpace ||  chessBoard[index+KDOWNRIGHT].charCodeAt() < COLORDELIMITER )){
            moves.push(index);
            moves.push(KDOWNRIGHT);
        }
        
        //LEFT AND UP
        if(index >= ONEROWFROMTOP && (index%ROWZISE !==LEFTCOLUMN && index%ROWZISE !== ONEFROMLEFT) &&( chessBoard[index+KLEFTUP] === emptySpace ||  chessBoard[index+KLEFTUP].charCodeAt() < COLORDELIMITER )){
            moves.push(index);
            moves.push(KLEFTUP);
        }
        //LEFT AND DOWN
        if(index < ONEROWFROMBOTTOM && (index%ROWZISE !==LEFTCOLUMN && index%ROWZISE !== ONEFROMLEFT) &&( chessBoard[index+KLEFTDOWN] === emptySpace ||  chessBoard[index+KLEFTDOWN].charCodeAt() < COLORDELIMITER )){
            moves.push(index);
            moves.push(KLEFTDOWN);
        }
        //RIGHT AND UP
        if(index >= ONEROWFROMTOP && index%ROWZISE !==RIGHTCOLUMN && index%ROWZISE !== ONEFROMRIGHT &&( chessBoard[index+KRIGHTUP] === emptySpace ||  chessBoard[index+KRIGHTUP].charCodeAt() < COLORDELIMITER )){
            moves.push(index);
            moves.push(KRIGHTUP);
        }
        //RIGHT AND DOWN
        if(index < ONEROWFROMBOTTOM && index%ROWZISE !==RIGHTCOLUMN && index%ROWZISE !== ONEFROMRIGHT &&( chessBoard[index+KIRGHTDOWN] === emptySpace ||  chessBoard[index+KIRGHTDOWN].charCodeAt() < COLORDELIMITER )){
            moves.push(index);
            moves.push(KIRGHTDOWN);
        }
    }
    if( chessBoard[index] === whiteKnight){
              //UP AND LEFT
          // cout << "index: " << index << "\n\n";
          // cout << " chessBoard[index]: " <<  chessBoard[index] << "\n\n";
      if(index >= TWOROWSFROMTOP && index%ROWZISE !== LEFTCOLUMN &&( chessBoard[index+KUPLEFT] === emptySpace ||  chessBoard[index+KUPLEFT].charCodeAt() > COLORDELIMITER )){
          moves.push(index);
          moves.push(KUPLEFT);
      }
      //UP AND RIGHT
      if(index >= TWOROWSFROMTOP && index%ROWZISE !== RIGHTCOLUMN &&( chessBoard[index+KUPRIGHT] === emptySpace ||  chessBoard[index+KUPRIGHT].charCodeAt() > COLORDELIMITER )){
          moves.push(index);
          moves.push(KUPRIGHT);
      }
      //DOWN AND LEFT
      if(index < TWOROWFROMBOTTOM && index%ROWZISE !== LEFTCOLUMN &&( chessBoard[index+KDOWNLEFT] === emptySpace ||  chessBoard[index+KDOWNLEFT].charCodeAt() > COLORDELIMITER )){
          moves.push(index);
          moves.push(KDOWNLEFT);
      }
      //DOWN AND RIGHT
      if(index < TWOROWFROMBOTTOM && index%ROWZISE !== RIGHTCOLUMN &&( chessBoard[index+KDOWNRIGHT] === emptySpace ||  chessBoard[index+KDOWNRIGHT].charCodeAt() > COLORDELIMITER )){
          moves.push(index);
          moves.push(KDOWNRIGHT);
      }
      
      //LEFT AND UP
      if(index >= ONEROWFROMTOP && (index%ROWZISE !==LEFTCOLUMN && index%ROWZISE !== ONEFROMLEFT) &&( chessBoard[index+KLEFTUP] === emptySpace ||  chessBoard[index+KLEFTUP].charCodeAt() > COLORDELIMITER )){
          moves.push(index);
          moves.push(KLEFTUP);
      }
      //LEFT AND DOWN
      if(index < ONEROWFROMBOTTOM && (index%ROWZISE !==LEFTCOLUMN && index%ROWZISE !== ONEFROMLEFT) &&( chessBoard[index+KLEFTDOWN] === emptySpace ||  chessBoard[index+KLEFTDOWN].charCodeAt() > COLORDELIMITER )){
          moves.push(index);
          moves.push(KLEFTDOWN);
      }
      //RIGHT AND UP
      if(index >= ONEROWFROMTOP && index%ROWZISE !==RIGHTCOLUMN && index%ROWZISE !== ONEFROMRIGHT &&( chessBoard[index+KRIGHTUP] === emptySpace ||  chessBoard[index+KRIGHTUP].charCodeAt() > COLORDELIMITER )){
          moves.push(index);
          moves.push(KRIGHTUP);
      }
      //RIGHT AND DOWN
      if(index < ONEROWFROMBOTTOM && index%ROWZISE !==RIGHTCOLUMN && index%ROWZISE !== ONEFROMRIGHT &&( chessBoard[index+KIRGHTDOWN] === emptySpace ||  chessBoard[index+KIRGHTDOWN].charCodeAt()> COLORDELIMITER )){
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
    console.log("firstOfRow",firstOfRow);
    if( chessBoard[index] === blackQueen){
        //left and right moves
        for(let i=1;i<8;i++){
            if(index-i >= firstOfRow && ( chessBoard[index-i].charCodeAt() < COLORDELIMITER ||  chessBoard[index-i] === emptySpace)){
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
            if(index+i < firstOfRow+8 && ( chessBoard[index+i].charCodeAt() < 91 ||  chessBoard[index+i] === emptySpace)){
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
            if(index+i <= 63 && ( chessBoard[index+i].charCodeAt() < 91 ||  chessBoard[index+i] === emptySpace)){
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
            if(index-i >= 0 && ( chessBoard[index-i].charCodeAt() < COLORDELIMITER ||  chessBoard[index-i] === emptySpace)){
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
            if(index+i <= 63 && ( chessBoard[index+i].charCodeAt() < 91 || chessBoard[index-i] === emptySpace)){
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
            if(index-i <= 63 && ( chessBoard[index-i].charCodeAt() < 91 || chessBoard[index-i] === emptySpace)){
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
            if(index+i <= 63 && ( chessBoard[index+i].charCodeAt()  < 91 || chessBoard[index+i] === emptySpace)){
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
           
            if(index%8 === 7 || index <= 7 || index-i < 0){ break;}
            if(index-i <= 63 && ( chessBoard[index-i].charCodeAt() < 91 || chessBoard[index-i] === emptySpace)){
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
            if(index-i >= firstOfRow && ( chessBoard[index-i].charCodeAt() > COLORDELIMITER ||  chessBoard[index-i] === emptySpace)){
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
            if(index+i < firstOfRow+8 && ( chessBoard[index+i].charCodeAt() > 91 ||  chessBoard[index+i] === emptySpace)){
                moves.push(index);
                moves.push(i);
                if( chessBoard[index+i] !== emptySpace){
                    break;
                }
            }else{
                break;
            }
        }
        //up and down
        for(let i=8;i<57;i=i+8){
            if(index+i <= 63 && ( chessBoard[index+i].charCodeAt() > 91 ||  chessBoard[index+i] === emptySpace)){
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
            if(index-i >= 0 && ( chessBoard[index-i].charCodeAt() > 91 ||  chessBoard[index-i] === emptySpace)){
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
            if(index+i <= 63 && ( chessBoard[index+i].charCodeAt() > 91 || chessBoard[index+i] === emptySpace)){
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
            if(index-i <= 63 && ( chessBoard[index-i].charCodeAt() > 91 || chessBoard[index-i] === emptySpace)){
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
            if(index+i <= 63 && ( chessBoard[index+i].charCodeAt() > 91 || chessBoard[index+i] === emptySpace)){
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
           
            if(index%8 === 7 || index <= 7 || index-i < 0){ break;}
            if(index-i <= 63 && ( chessBoard[index-i].charCodeAt() > 91 || chessBoard[index-i] === emptySpace)){
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
    // cout <<  chessBoard[index+7].charCodeAt();
    if((index+left >= firstOfRow )&& (( chessBoard[index+left])).charCodeAt() < COLORDELIMITER ||  chessBoard[index+left] === emptySpace){
                moves.push(index);
                moves.push(left);
    }
    if((index+right < firstOfRow+ROWZISE )&& (( chessBoard[index+right])).charCodeAt() < COLORDELIMITER ||  chessBoard[index+right] === emptySpace){
                moves.push(index);
                moves.push(right);
    }
    if((index+spaceDown <= MAXBOARDINDEX )&& (( chessBoard[index+spaceDown])).charCodeAt() < COLORDELIMITER ||  chessBoard[index+spaceDown] === emptySpace){
                moves.push(index);
                moves.push(spaceDown);
    }
    if((index+spaceUp >= 0 ) && (( chessBoard[index+spaceUp])).charCodeAt() < COLORDELIMITER ||  chessBoard[index+spaceUp] === emptySpace){
                moves.push(index);
                moves.push(spaceUp);
    }
  
  
    if((index+rightDown <= MAXBOARDINDEX  && (index%ROWZISE !== RIGHTCOLUMN && index < MAXBOARDINDEX ))&&(( chessBoard[index+rightDown])).charCodeAt() < COLORDELIMITER ||  chessBoard[index+rightDown] === emptySpace){
        moves.push(index);
        moves.push(rightDown);
    }
    if((index+leftUp <= MAXBOARDINDEX && (index%ROWZISE !== LEFTCOLUMN && index >= ONEROWFROMTOP  ))&&(( chessBoard[index+leftUp])).charCodeAt() < COLORDELIMITER ||  chessBoard[index+leftUp] === emptySpace){
        moves.push(index);
        moves.push(leftUp);
    }
    if((index+leftDown <= MAXBOARDINDEX  && (index%ROWZISE !== LEFTCOLUMN && index < MAXBOARDINDEX )) && (( chessBoard[index+leftDown])).charCodeAt() < COLORDELIMITER ||  chessBoard[index+leftDown] === emptySpace){
        moves.push(index);
        moves.push(leftDown);
    }
    if((index+rightUp <= MAXBOARDINDEX &&  (index%ROWZISE !== RIGHTCOLUMN && index >= ONEROWFROMTOP  )) && (( chessBoard[index+rightUp])).charCodeAt() < COLORDELIMITER ||  chessBoard[index+rightUp] === emptySpace){
        moves.push(index);
        moves.push(rightUp);
    }
  
    }
    if( chessBoard[index] === whiteKing){
    // cout << "made it";
    // cout <<  chessBoard[index+7].charCodeAt();
    if((index+left >= firstOfRow )&& (( chessBoard[index+left])).charCodeAt() > COLORDELIMITER ||  chessBoard[index+left] === emptySpace){
                moves.push(index);
                moves.push(left);
    }
    if((index+right < firstOfRow+ROWZISE )&& (( chessBoard[index+right])).charCodeAt() > COLORDELIMITER ||  chessBoard[index+right] === emptySpace){
                moves.push(index);
                moves.push(right);
    }
    if((index+spaceDown <= MAXBOARDINDEX )&& (( chessBoard[index+spaceDown])).charCodeAt() > COLORDELIMITER ||  chessBoard[index+spaceDown] === emptySpace){
                moves.push(index);
                moves.push(spaceDown);
    }
    if((index+spaceUp >= 0 ) && (( chessBoard[index+spaceUp])).charCodeAt() > COLORDELIMITER ||  chessBoard[index+spaceUp] === emptySpace){
                moves.push(index);
                moves.push(spaceUp);
    }
  
    if((index+rightDown <= MAXBOARDINDEX  && (index%ROWZISE !== RIGHTCOLUMN && index < MAXBOARDINDEX ))&&(( chessBoard[index+rightDown])).charCodeAt() > COLORDELIMITER ||  chessBoard[index+rightDown] === emptySpace){
        moves.push(index);
        moves.push(rightDown);
    }
    if((index+leftUp <= MAXBOARDINDEX && (index%ROWZISE !== LEFTCOLUMN && index > ONEROWFROMTOP  ))&&(( chessBoard[index+leftUp])).charCodeAt() > COLORDELIMITER ||  chessBoard[index+leftUp] === emptySpace){
        moves.push(index);
        moves.push(leftUp);
    }
    if((index+leftDown <= MAXBOARDINDEX  && (index%ROWZISE !== LEFTCOLUMN && index < MAXBOARDINDEX )) && (( chessBoard[index+leftDown])).charCodeAt() > COLORDELIMITER ||  chessBoard[index+leftDown] === emptySpace){
        moves.push(index);
        moves.push(leftDown);
    }
    if((index+rightUp <= MAXBOARDINDEX &&  (index%ROWZISE !== RIGHTCOLUMN && index > ONEROWFROMTOP  )) && (( chessBoard[index+rightUp])).charCodeAt() > COLORDELIMITER ||  chessBoard[index+rightUp] === emptySpace){
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
    
        if( chessBoard[index+rightDown] !== emptySpace &&  chessBoard[index+rightDown].charCodeAt() < COLORDELIMITER){
            moves.push(index);
            moves.push(rightDown);
        }
        if( chessBoard[index+leftDown] !== emptySpace &&  chessBoard[index+leftDown].charCodeAt() < COLORDELIMITER){
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
    
        if( chessBoard[index+rightUp] !== emptySpace &&  chessBoard[index+rightUp].charCodeAt() > COLORDELIMITER){
            moves.push(index);
            moves.push(rightUp);
        }
        if( chessBoard[index+leftUp] !== emptySpace &&  chessBoard[index+leftUp].charCodeAt() > COLORDELIMITER){
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
  if(index>=40) return 40;
  if(index>=32) return 32;
  if(index>=24) return 24;
  if(index>=16) return 16;
  if(index>=8) return 8;
  return 0;
  }