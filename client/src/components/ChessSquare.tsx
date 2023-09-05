import { Show, createSignal, onMount, Setter, Accessor } from "solid-js";
import { className } from "solid-js/web";
import { useDragDropContext } from "./DragDropContext";
import {updateMove} from "../Classes/Types";


type Props = {
  pieceClassName: string;
  className: string;
  id: string;
  board: any;
  draggableId: string;
  updateBoard: any;
  eatenPieces: any;
  displayInlay: any;
  setDisplayInlay: any;
  setDisplayInlayX: any;
  inlaySelection: any;
  style: any;
  color: string;
  setLastMove: any;
  lastMove: any;
  movePieceSound: any;
  capturePieceSound: any;
  setMoves: Setter<updateMove[]>;
  moves: Accessor<updateMove[]>;
};




function ChessSquare({
  pieceClassName,
  className,
  id,
  board,
  draggableId,
  updateBoard,
  eatenPieces,
  setDisplayInlay,
  setDisplayInlayX,
  inlaySelection,
  displayInlay,
  style,
  color,
  setLastMove,
  lastMove,
  movePieceSound,
  capturePieceSound,
  setMoves,
  moves
}: Props) {




  onMount(() => {
    window.movePiece = function(start, end){
      board().movePiece(start, end);
      updateBoard();
    };
    window.board = board;
    // capturePieceSound.play();
  });




  const Droppable = ({ id, className, draggable, draggableClass }: any) => {
    const {
      onHoverOver,
      createDroppable,
      onHoverOut,
      onGlobalDragStart,
      onGlobalDragEnd,
    } = useDragDropContext();
    const droppable = createDroppable(id);

    onHoverOver((e: any) => {
      droppable.ref.classList.add("hovered");
    }, droppable);

    onHoverOut((e: any) => {
      droppable.ref.classList.remove("hovered");
    }, droppable);

    onGlobalDragStart((e: any) => {
        if(displayInlay()){return;}
        if (e.data.legalPieceMoves.includes(droppable.id)) {
          if (droppable.ref.children.length === 0 || (droppable.ref.querySelector(".piece") == undefined)) {
            droppable.droppable = true;
            let newElement = document.createElement("section");
            newElement.classList.add("circle");
            droppable.ref.appendChild(newElement);
          } else if (droppable.ref.children.length > 0 && (droppable.ref.querySelector(".piece") != undefined) ) {
            droppable.droppable = true;
            let piece;
            for(let i = 0; i < droppable.ref.children.length; i++){
              if(droppable.ref.children[i].classList.contains("piece")){
                piece = droppable.ref.children[i];
              }
            }
            piece.children[0]?.classList.add("circle");
            // droppable.ref.children[0]?.children[0]?.classList.add("circle");
          }
        } else {
          droppable.droppable = false;
        }
    });

    onGlobalDragEnd((e: any) => {
      // droppable.droppable = false;
      // droppable.ref.classList.remove("hovered");
      let circles = droppable.ref.querySelectorAll("section.circle");
      for (let i = 0; i < circles.length; i++) {
        circles[i].remove();
      }
      let pieceCircles = droppable.ref.querySelectorAll("div.circle");
      for (let i = 0; i < pieceCircles.length; i++) {
        pieceCircles[i].classList.remove("circle");
      }

      //loop over all droppables and if their id matches lastMove, add class lastMove
    });

    if (draggable.getAttribute("class").length === 0) {
      draggable = undefined;
    }

    return (
      <div id={id} class={className} ref={droppable.ref} style={style}>
        <Show when={draggable != undefined}>{draggable}</Show>
        <Show when={(id[1] === '8' && color === "black") || (id[1] === '1' && color === "white")}>
          <div class={"number-right"} style={"pointer-events: none;"}>{id[0]}</div>
        </Show>
        <Show when={(id[0] === 'h' && color === "black") || (id[0] === 'a' && color ==="white")}>
          <div class="number-left" style={"pointer-events: none;"}>{id[1]}</div>
        </Show>
      </div>
    );
  };

  const Draggable = ({ className, id }: any) => {
    const { onDragStart, onDragEnd, createDraggable } = useDragDropContext();
    const draggable = createDraggable(id);

    let startingIndex: string;
    let endingIndex: string;

    onDragStart(() => {
      // console.log("dragging piece", board().currentTurnColor);
      // board().displayBoard();
      if(displayInlay()) return;
      startingIndex = draggable.ref.parentElement.id;
      let legalMoves = board().findLegalMoves(board());
      // console.log(legalMoves);
      // console.log(board().Pieces)
      if(legalMoves.length === 0){
        board().checkMate = true;
      }
      let legalPieceMoves = [];
      // console.log("start")

      for (let i = 0; i < legalMoves.length; i++) {
        if (legalMoves[i].start == startingIndex) {
          legalPieceMoves.push(legalMoves[i].end);
        }
      }
      draggable.data.legalPieceMoves = legalPieceMoves;
    }, draggable);

    onDragEnd(async (e: any) => {
      if(displayInlay()) return;
      // console.log(e)
      if (e === null) return;
      e.occupied = false;
      // console.log(e.ref.children);
      if(e.ref.querySelector(".circle") === null){
        return;
      }
      
      let previousChild = e.ref.querySelector(".piece");
      // console.log("previous", previousChild);
      await delay(1);
      let oppositeColor;
      if (previousChild?.id === draggable?.id) {
        endingIndex = draggable.ref.parentElement.id;
      }else{
        endingIndex = e.ref.id;
      }
      // console.log("draggable", startingIndex);
      // console.log("ending", endingIndex);
      // console.log(e.ref.id)
        if (endingIndex === startingIndex) return;
        // // // console.log("legal move");
        let previousBoard = board().board;


        // console.log("moving piece", startingIndex, endingIndex);
        // console.log(previousChild.id, draggable.id)
        // here I need to delay this move if I am crowning a pawn
        let newMove = new updateMove(
          startingIndex,
          endingIndex,
          board().fen,
        )
        board().movePiece(startingIndex, endingIndex);
        // console.log("moved piece", startingIndex, endingIndex);
        // board().displayBoard();
        
        // //this is where I move the piece


        //here I check if I ate a piece and add it to the list of eaten pieces
        if (previousChild?.classList?.contains("piece")) {
          eatenPieces.push(previousChild);
          newMove.eating = true;
          newMove.atePiece = board().getPieceAtPosition(endingIndex)?.type;
          let sound = capturePieceSound.play();
          // console.log(eatenPieces);
        }else{
          // console.log("sound")
          let sound = movePieceSound.play();

        }

        //checks if I am crowning and only send move if not
        let piece = board().getPieceAtPosition(endingIndex);
        if (piece.type === "p" && piece.color === color) {
            if (endingIndex[1] === "8" || endingIndex[1] === "1") {
              newMove.crowning = true;
              setDisplayInlay(true);
              setDisplayInlayX(piece.position.pos.x);


            }else{
              let move = { start: startingIndex, end: endingIndex };
              // updateGameQL(move, board().fen);
            }
          }else{
            let move = { start: startingIndex, end: endingIndex };
            // updateGameQL(move, board().fen);
          }

      
        setMoves([...moves(), newMove]);
        updateBoard();
        
        //fix issues with numbers
        if(previousChild?.classList?.contains("number-right") || previousChild?.classList?.contains("number-left")){
          e.ref.appendChild(previousChild);
        }


        //highlight last move in green
        setLastMove({ from: startingIndex, to: endingIndex });
        let allDroppables = document.querySelectorAll(".chessSquare");
        for (let i = 0; i < allDroppables.length; i++) {
          if (allDroppables[i].id === lastMove().from || allDroppables[i].id === lastMove().to) {
            allDroppables[i]?.classList?.add("lastMove");
          } else {
            allDroppables[i]?.classList?.remove("lastMove");
          }
        }


      }, draggable);

    const currentPieceColor = pieceClassName.toUpperCase() === pieceClassName ? "white" : "black";
    const canDrag = color === currentPieceColor;
    return (
      <section ref={draggable.ref} class={`${className} ${canDrag ? "canDrag" : "noDrag"}`} id={id}>
        {/* //pointer-events: none; */}
        <div class=""> </div>
      </section>
    );
  };


  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  //so I would like the change in board to reflect a change in the UI
  //this seems a bit difficult since an update to board does not seem to trigger re-render.
  return (
    <Droppable
      className={className}
      draggable={
        <Draggable
          className={`${
            pieceClassName != " " ? pieceClassName + " piece" : ""
          }`}
          id={draggableId}
        />
      }
      id={id}
    />
  );
}

export default ChessSquare;
