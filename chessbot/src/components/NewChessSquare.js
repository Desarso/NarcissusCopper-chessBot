import React from 'react';
import ReactDOM from "react-dom";
import {useRef} from 'react';
import $ from 'jquery';
import  '../../node_modules/jquery-ui/dist/jquery-ui';

class DragMe extends React.Component {
    constructor() {
      super();
      this.dragRef = React.createRef();
     
    }
  
    componentDidMount() {
      this.$dragMe = $(this.dragRef.current);
      this.$dragMe.draggable({
        helper: "clone"
      }); 
    }
  
    componentDidUpdate(prevProps) {}
  
    componentWillUnmount() {}
  
    handleChange(e) {}
   
    render() {
      return (
        <section 
             ref={this.dragRef}
             className = {this.props.className}
             >
        </section>
      );
    }
  }
  

function NewChessSquare({text, className, chessBoard, index}) {

  const refContainer = useRef(index);
  let pieceClass = '';
  if(text === '-') pieceClass = ''; 
  if(text === 't' || text === 'r'){pieceClass = 'piece rook';}
  if(text === 'b')  pieceClass = 'piece bishop';
  if(text === 'n')  pieceClass = 'piece knight';
  if(text === 'k')  pieceClass = 'piece king';
  if(text === 'q')  pieceClass = 'piece queen';
  if(text === 'p')  pieceClass = 'piece pawn';
  if(text === 'T' || text === 'R')  pieceClass = 'piece white rook';
  if(text === 'B') pieceClass = 'piece white bishop';
  if(text === 'N') pieceClass = 'piece white knight';
  if(text === 'K') pieceClass = 'piece white king';
  if(text === 'Q') pieceClass = 'piece white queen';
  if(text === 'P') pieceClass = 'piece white pawn';

  if(className != undefined)  pieceClass += className;

  return (
    <div className={className}>
         <DragMe
         className={`${pieceClass}`}
         />
    </div>
       
  )
}

export default NewChessSquare



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
  if(twoStringMatch(oldClass, previousClass).length == oldClass.length){
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
          if (i == 0 || j == 0)
              LCSuff[i][j] = 0;

          else if (X[i-1] == Y[j-1]) {
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
  if (len == 0) {
      // console.log("No Common Substring");
      return "";
  }

  // allocate space for the longest common substring
  let resultStr = "";

  // traverse up diagonally form the (row, col) cell
  // until LCSuff[row][col] != 0
  while (LCSuff[row][col] != 0) {
      resultStr = X[row-1] + resultStr; // or Y[col-1]
      --len;

      // move diagonally up to previous cell
      row--;
      col--;
  }
  // console.log("Common sub:",resultStr.trim());
  return resultStr.trim();
}
