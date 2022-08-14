import {
    DragDropProvider,
    DragDropSensors,
    useDragDropContext,
    createDraggable,
    createDroppable,
    DragOverlay
  } from "@thisbeyond/solid-dnd";
import { get } from "jquery";
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






function ChessSquare({text, className, chessBoard, index, hoveredElement, 
                        setHovered, key, handleBoardChange, litUpBoxes, 
                        setLitUpBoxes, activeItem, setActiveItem, previousMove, setPreviousMove,
                        pieceClass, setPieceClass
                    }) {


    let lastMove;



    //white first indices are 
    //0-7,16-23
    function getClassNameFromIndex(index){
        // console.log(index);
       if((index >= 56)||
          (index >=40 && index < 48)||
          (index >=24 && index < 32)||
          (index >=8  && index < 16)){
            if(index%2 ==1){
                return 'lighterBackground';
            }
       }else{
        if(index%2 ==0){
            return 'lighterBackground';
        }
       }
    }

    //get classes


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
              moves.push(...findPawnMoves(chessBoard(), index, moves));
          }
        moves = moves.filter((move) => {
           if(move != undefined){
            return move;
         };
        });
    
    // console.log(chessBoard()[index]);
    console.log("moves", moves);
    console.log("~~~~~~~~~~~~~~~~~~~~");
    if(moves.length >0){
        let newBoxes = litUpBoxes();

       
    
        for(let i=0;i<moves.length;i=i+2){
            if(moves[i] != undefined && moves[i+1] != undefined){
            newBoxes[moves[i]+moves[i+1]] = 'circle';
            }
            if(moves[i] === 99 && moves[i+1] === 99){
                newBoxes[2] = 'circle';
            }
            if(moves[i] === 98 && moves[i+1] === 98){
                newBoxes[6] = 'circle';
            }
            if(moves[i] === 97 && moves[i+1] === 97){
                newBoxes[58] = 'circle';
            }
            if(moves[i] === 96 && moves[i+1] === 96){
                newBoxes[62] = 'circle';
            }
        }
        setLitUpBoxes(newBoxes);
    }
          
       
    
      }

    const Draggable = ({id, index, className}) => {
        const droppable = createDroppable(id);
        const draggable = createDraggable(id);
        const [,{onDragEnd, onDragStart, activeDraggable }] = useDragDropContext();
        // console.log(index);
        onDragEnd(({draggable}) => {

            //active === draggable;
            //hovered === box;
            //
        
            if(index === hoveredElement() && activeItem() != null){
             
                //get the piece class
                let newClass = activeItem().getAttribute('class');
                let CurrentIndex = activeItem().getAttribute('index')-0;
                let NewIndex = hoveredElement();
                let newChessBoard = chessBoard();
                let newPieceClass = pieceClass();
                
                //set the last move
                lastMove = [activeItem().getAttribute('index')-0, hoveredElement()-activeItem().getAttribute('index')];
                setPreviousMove(lastMove);
            
           
                //set newChessboard state
                newChessBoard[hoveredElement()] = newChessBoard[activeItem().getAttribute('index')-0];
             
             
                console.log(CurrentIndex);
                console.log(chessBoard()[CurrentIndex]);
                let newPieceClasses = pieceClass();
                //so when going forward current + 8 = new; 8 = new-current;
                if(chessBoard()[CurrentIndex] === whitePawn || chessBoard()[CurrentIndex] === blackPawn){
                    console.log("piece is a pawn");
                    if(NewIndex-CurrentIndex != 8 || NewIndex-CurrentIndex != -8){
                        if(chessBoard()[CurrentIndex] === blackPawn && NewIndex-CurrentIndex === 7){
                            newChessBoard[CurrentIndex+left] = '-';
                            newPieceClasses[CurrentIndex+left] = '-';
                        }
                        if(chessBoard()[CurrentIndex] === blackPawn && NewIndex-CurrentIndex === 9){
                            newChessBoard[CurrentIndex+right] = '-';
                            newPieceClasses[CurrentIndex+right] = '-';
                        }
                        if(chessBoard()[CurrentIndex] === whitePawn && NewIndex-CurrentIndex === -7){
                            newChessBoard[CurrentIndex+right] = '-';
                            newPieceClasses[CurrentIndex+right] = '-';
                        }   
                        if(chessBoard()[CurrentIndex] === whitePawn && NewIndex-CurrentIndex === -9){
                            newChessBoard[CurrentIndex+left] = '-';
                            newPieceClasses[CurrentIndex+left] = '-';

                        }
                    }
                }

                if(activeItem().getAttribute('index')-0 != hoveredElement()){
                    newChessBoard[activeItem().getAttribute('index')-0] = '-';
                }

                if(chessBoard()[NewIndex] === whiteKing || chessBoard()[NewIndex] === blackKing){
                    
                    if(CurrentIndex-NewIndex === 2 || CurrentIndex-NewIndex === -2){
                     
                        if(NewIndex === 58){
                            newChessBoard[56] = '-';
                            newPieceClass[56] = '-';
                            newChessBoard[59] = 'R';
                            newPieceClass[59] = 'piece white rook'
                        }
                        if(NewIndex === 62){
                            newChessBoard[63] = '-';
                            newPieceClass[63] = '-';
                            newChessBoard[61] = 'R';
                            newPieceClass[61] = 'piece white rook'
                        }
                        if(NewIndex === 2){
                            newChessBoard[0] = '-';
                            newPieceClass[0] = '-';
                            newChessBoard[3] = 'r';
                            newPieceClass[3] = 'piece rook'
                        }
                        if(NewIndex === 6){
                            newChessBoard[7] = '-';
                            newPieceClass[7] = '-';
                            newChessBoard[5] = 'r';
                            newPieceClass[5] = 'piece rook'
                        }
                        handleBoardChange(newChessBoard);
                    }
                }
           
                
                // console.log(previousMove());
               
                
                // console.log(newchessBoard);
                handleBoardChange(newChessBoard);
        
                displayBoard(newChessBoard);
                // console.log(chessBoard());
              
                newPieceClass[hoveredElement()] = newClass;
                setPieceClass(newPieceClass);
            
            }



            if(index === activeItem().getAttribute('index')-0 && activeItem().getAttribute('index') != hoveredElement()){
                let newPieceClass = pieceClass();
                newPieceClass[activeItem().getAttribute('index')] = '-';
                setPieceClass(newPieceClass);
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
         
     

           
           if(index === draggable.node.getAttribute('index')-0){
                setActiveItem(draggable.node);
                console.log("Previous:",previousMove());
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
                    class = {`${pieceClass()[index]}`}
                    index = {index}
                    >
                        <div class = {`${litUpBoxes()[index]}`}></div>
                    </section>
            </div>
        );
       
      };

       //pawns know to eat- need to leart em-peassant or whatever

  function findPawnMoves( chessBoard, index ){
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
        console.log("made it here");
        if( chessBoard[index+spaceDown] === emptySpace){
            moves.push(index);
            moves.push(spaceDown);
        }
        
        if(index >=32 && index <= 39){
            //this deals with black en-peseant
            if( chessBoard[index+right] === whitePawn){
                if(previousMove()[0]+previousMove()[1] === index+1 && previousMove()[1] === -16){
                    moves.push(index);
                    moves.push(rightDown);
                }
            }
            if( chessBoard[index+left] === whitePawn){
                if(previousMove()[0]+previousMove()[1] === index+1 && previousMove()[1] === -16){
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
        
        console.log("white pawn index is:", index);
        if(index >=24 && index <= 31){
                 console.log("made it");
            if( chessBoard[index+right] === blackPawn){
                if(previousMove()[0]+previousMove()[1] === index+right && previousMove()[1] === 16){
                    moves.push(index);
                    moves.push(rightUp);
                }
            }
            if( chessBoard[index+left] === blackPawn){
                if(previousMove()[0]+previousMove()[1] === index+left && previousMove()[1] === 16){
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
 
    // if(className !== undefined)  pieceClass += className;
  return (
   
        <Draggable
                index = {index}
                id = {key}
                className = {`${className} ${getClassNameFromIndex(index)} ${litUpBoxes()[index]}`}
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
  
  
  //first we check if castling is possible.
  if(chessBoard[index] == blackKing){
    //the blackKing begins at index position 4;
    //it must check that position 1,2,3 are clear.
    //for queen side castling.
    //and for 5,6 to be clear for king side, as well
    //ass check that the rook is a t
    if(chessBoard[0] == 't' && chessBoard[1] == emptySpace && chessBoard[2] == emptySpace && chessBoard[3] ==  emptySpace){
       moves.push(99);
       moves.push(99);
    }
    
    if(chessBoard[7] == 't' && chessBoard[5] == emptySpace && chessBoard[6] == emptySpace){
        moves.push(98);
        moves.push(98);
    }

  
  //the index for the other rooks are 56 and 63;
    
}

if(chessBoard[index] == whiteKing){
    //for white king the index position is 60
    //for queen side it must check 59,58,57
    //for king side it must check 61,62

    if(chessBoard[56] == 'T' && chessBoard[59] == emptySpace && chessBoard[58] == emptySpace && chessBoard[57] == emptySpace){
          moves.push(97);
          moves.push(97);
    }
    if(chessBoard[63] == 'T' && chessBoard[61] == emptySpace && chessBoard[62] == emptySpace){
        moves.push(96);
        moves.push(96);
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

  function displayBoard(chessBoard){
    for(let i=0;i<chessBoard.length;i=i+8){
        console.log(chessBoard[i],chessBoard[i+1],chessBoard[i+2],chessBoard[i+3],chessBoard[i+4],chessBoard[i+5],chessBoard[i+6],chessBoard[i+7],"\n");
    }
  }