import { Show, createSignal, onMount } from "solid-js";
import { className } from "solid-js/web";
import { useDragDropContext } from "./DragDropContext";


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
  client: any;
  gql: any;
  gameId: string;
  setLastMove: any;
  lastMove: any;
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
  client,
  gql,
  gameId,
  setLastMove,
  lastMove,
}: Props) {


  const updateGame = gql`
  mutation($from: String!, $to: String!, $endFen: String!, $gameId: String!) {
    moveChessPiece(from: $from, to: $to, endFen: $endFen, gameId: $gameId) {
      fen
    }

  }
`

  onMount(() => {
    window.movePiece = function(start, end){
      board().movePiece(start, end);
      updateBoard();
    };
    window.board = board;
  });

  const [moves, setMoves] = createSignal([]);



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
      // console.log("hover over");
      // console.log(e);
      // droppable.droppable = false;
      //should only accept a drop if it is a legal move;
      // if(droppable.ref.classList.contains("lighterBackground")){
      //     droppable.droppable = true;
      // }
      droppable.ref.classList.add("hovered");
      // console.log(e.data.legalPieceMoves);
    }, droppable);

    onHoverOut((e: any) => {
      // console.log("hover out");
      droppable.ref.classList.remove("hovered");
    }, droppable);

    onGlobalDragStart((e: any) => {
        if(displayInlay()){return;}
        if (e.data.legalPieceMoves.includes(droppable.id)) {
          // console.log(e.data.legalPieceMoves);
          // console.log(droppable.id);
          // console.log(droppable.id)
          if (droppable.ref.children.length === 0 || (droppable.ref.children.length === 1 && !droppable.ref.children[0].classList.contains("piece"))) {
            droppable.droppable = true;
            let newElement = document.createElement("section");
            newElement.classList.add("circle");
            droppable.ref.appendChild(newElement);
          } else if (droppable.ref.children.length === 1 && droppable.ref.children[0].classList.contains("piece")) {
            droppable.droppable = true;
            // droppable.ref.children[0].children[0].classList.add('circle');
            droppable.ref.children[0]?.children[0]?.classList.add("circle");
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
      // console.log("end")
      if (e === null) return;
      e.occupied = false;
      // console.log(e);
      let previousChild = e.ref.children[0];
      // for(let i = 0; i < e.ref.children.length; i++){
      //   if(!e.ref.children[i].classList.contains("number-right") || !e.ref.children[i].classList.contains("number-left")){
      //     previousChild = e.ref.children[i];
      //   }
      // }
      console.log("prev",previousChild);
      console.log("id",e.ref.id)

      await delay(1);
      let oppositeColor;
      if (!e.ref.children[0]) return;
      if (e.ref.children[0].id === draggable.id) {
        endingIndex = draggable.ref.parentElement.id;
        if (endingIndex === startingIndex) return;
        // // // console.log("legal move");
        let previousBoard = board().board;

        board().movePiece(startingIndex, endingIndex);
        // //this is where I move the piece
        let move = { start: startingIndex, end: endingIndex };
        updateGameQL(move, board().fen);


        setMoves([...moves(), { start: startingIndex, end: endingIndex }]);
        if (previousChild.classList.contains("piece")) {
          eatenPieces.push(previousChild);
          console.log(eatenPieces);
        }

        let newBoard = board().board;
        let numberOfChanges = 0;
        console.log(board().inCheck);
        let piece = board().getPieceAtPosition(endingIndex);
        if (piece.type === "p" && piece.color === color) {
            if (endingIndex[1] === "8" || endingIndex[1] === "1") {
              setDisplayInlay(true);
              setDisplayInlayX(piece.position.pos.x);
            }
          }
        //I'm gonna implement the crowning logic here,
        //there is a problem, the board is going to have a pawn of opposite color
        //at the end of the board
        //when that happend I need make a popup appear that allows for chess selection
        //what I need is an absolute position inlay that appears on the board
        //it extends for four spaces downwards, but has not border, and the backgroud is white


        updateBoard();
        board().displayBoard();

        if(previousChild.classList.contains("number-right") || previousChild.classList.contains("number-left")){
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

      }
    }, draggable);

    const currentPieceColor = pieceClassName.toUpperCase() === pieceClassName ? "white" : "black";
    const canDrag = color === currentPieceColor;
    return (
      <section ref={draggable.ref} class={className} style={`${canDrag ? "" : ""}`} id={id}>
        {/* //pointer-events: none; */}
        <div class=""> </div>
      </section>
    );
  };


  function updateGameQL(move: any, fen: string) {
    console.log("update game", gameId());
    client.
    mutate({
      mutation: updateGame,
      variables: {
        from: move.start,
        to: move.end,
        endFen: fen,
        gameId: gameId()
      }
    })
    .then((result: any) => {
      console.log(result);
    })
  }

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
