import React from 'react';
import ReactDOM from "react-dom";
import { useEffect, useRef, useState} from 'react';
import { DndProvider, useDrag, useDrop, DragPreviewImage, dragPreview} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';



const $ = window.$;

class Droppable extends React.Component {
  constructor() {
    super();
    this.dropRef = React.createRef();
  }

  componentDidMount() {
    this.$drop = $(this.dropRef.current);
    this.$drop.droppable({
      accept: ".draggable",
      classes: {
        "ui-droppable-active": "onDraging",
        "ui-droppable-hover": "onDragOver"
      },
      drop: (evt, ui) => {
        console.log({
          position: ui.position,
          ui,
          evt
        });
        const { left: dragLeft, top: dragTop } = ui.position;
        const { left: dropLeft, top: dropTop } = this.$drop.offset();
        const top = dragTop - dropTop;
        const left = dragLeft - dropLeft;
        const height = ui.helper.height();
        const width = ui.helper.width();
        this.$drop.append(
          `<div style="left: ${left}px; top: ${top}px; border: 1px dashed rgba(0,0,0,.2); position: absolute; border-radius: 4px; width: ${width}px; height: ${height}px; color: rgba(0,0,0,.2)">Dropped</div>`
        );
      }
    });
  }

  componentDidUpdate(prevProps) {}

  componentWillUnmount() {}

  handleChange(e) {}

  render() {
    return <section className="droppable" ref={this.dropRef} />;
  }
}

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
      <section className="draggable" ref={this.dragRef}>
        Drag Me
      </section>
    );
  }
}

class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.handleChange = this.handleChange.bind(this);
    this.$el.on("change", this.handleChange);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger("chosen:updated");
    }
  }

  componentWillUnmount() {
    this.$el.off("change", this.handleChange);
    this.$el.chosen("destroy");
  }

  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={(el) => (this.el = el)}>
          {this.props.children}
        </select>
      </div>
    );
  }
}



function ChessSquare({text, className, chessBoard, index}) {
  const PieceTypes = {
    ROOK : 'rook',
    BISHOP : 'bishop',
    KNIGHT : 'knight',
    KING : 'king',
    QUEEN : 'queen',
    PAWN : 'pawn',
  }

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

  // console.log(chessBoard);

  if(className != undefined)  pieceClass += className;

//react DnD

//   const [dropBox, setDropBox] = useState('none');
//   const dragItem = useRef();
//   const dragOverItem = useRef();

//   const[{isDragging}, drag, dragPreview] = useDrag(() => ({
//     type: PieceTypes.KNIGHT,
//     collect: monitor => ({
//       isDragging : !!monitor.isDragging()
//     })
//   }))

//   const [,drop] = useDrop(
//     () => ({
//       accept: PieceTypes.KNIGHT,
//       drop: () => console.log("dropped")
//     }),[]
//   )

// const [{isOver}, dropped] = useDrop(
//   () => ({
//     accept: PieceTypes.KNIGHT,
//     drop: () => console.log("is over dropped knight"),
//     collect: monitor => ({
//       isOver: !!monitor.isOver(),
//     })
//   })
// )


//vanilla javascript 

  // const dragStart = (e, position) => {
  //   e.target.className = addClass(e.target.className, "invisible");
  //   console.log(e.target.className);
  //   dragItem.current = position;
  //   // console.log("Gragged class", e.target.className);
  // }

  // const dragEnter = (e, position) => {
  //   dragOverItem.current = position;
  //   console.log(position);
  // }

  // const drop = (e, position) => {
  //   console.log("ass");
  //   // console.log(position);
  //   e.target.className = removeClass(e.target.className, "invisible");
  // }
 
 let isEmptySquare = false;

  twoStringMatch(pieceClass, "piece").length == 5
    ? isEmptySquare = false
    : isEmptySquare = true;

 

  return (
    <>
    {/* <DragPreviewImage 
      connect={dragPreview} 
      className = {pieceClass}
      src="./images/whiteBishop.png"
      /> */}
    <div
      // {...isEmptySquare 
      //   && ondragover={(e) =>this.ondragOver(e)}} 
      // ref ={isEmptySquare ? dropped : drag}
      
      className={ `${pieceClass}`}
      // style={{
      //   opacity: isDragging ? 1 : 1,
      //   backgroundImage: isDragging && 'none',
      //   backgroundColor: isOver && 'yellow !important',
      //   cursor: isDragging && 'pointer'
      // }}
      // onDragStart={(e) => dragStart(e, index)}
      // onDragEnter={(e) => dragEnter(e, index)}
      // onDragEnd = {(e) => drop(e, index)}
      text = {text}
      // draggable
      ></div>
    </>
    
  )
}

export default ChessSquare;



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

