import { Show } from "solid-js";
import { className } from "solid-js/web";
import { useDragDropContext } from "./DragDropContext";
import board from "./Chessboard";


type Props = {
    pieceClassName : string,
    className : string,
    id : string
    board : any,
    draggableId : string
}








function ChessSquare({pieceClassName, className, id, board, draggableId}: Props) {


    const Droppable = ({ id, className, draggable, draggableClass} : any) => {
        const { onHoverOver, createDroppable, onHoverOut, onGlobalDragStart, onGlobalDragEnd } = useDragDropContext();
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
            // console.log(e.data.legalPieceMoves);
            // console.log(droppable.id)
            if(e.data.legalPieceMoves.includes(droppable.id)){
                if(droppable.ref.children.length === 0){
                    droppable.droppable = true;
                    let newElement = document.createElement("section");
                    newElement.classList.add('circle');
                    droppable.ref.appendChild(newElement)
                }else if(droppable.ref.children.length === 1){
                    droppable.droppable = true;
                    // droppable.ref.children[0].children[0].classList.add('circle');
                    droppable.ref.children[0].children[0].classList.add('circle');
                    
                }
                
            }else{
                droppable.droppable = false;
            }
        });

        onGlobalDragEnd((e: any) => {
            // droppable.droppable = false;
            // droppable.ref.classList.remove("hovered");
            let circles = droppable.ref.querySelectorAll('section.circle');
            for(let i = 0; i < circles.length; i++){
                circles[i].remove();
            }
            let pieceCircles = droppable.ref.querySelectorAll('div.circle');
            for(let i = 0; i < pieceCircles.length; i++){
                pieceCircles[i].classList.remove('circle');
            }

            
        })

        
    
       if(draggable.getAttribute('class').length === 0){
        draggable = undefined;
       }
    
        return (
        <div
        id={id}
        class={className}
        ref={droppable.ref}
        >
        <Show when={draggable != undefined}>
            {draggable}
        </Show>
        </div>
        )
    
  }

    const Draggable = ({className, id }: any) => {
        const { onDragStart, onDragEnd, createDraggable } = useDragDropContext();
        const draggable = createDraggable(id);

        let startingIndex: string;
        let endingIndex: string;
    
        onDragStart(() => {
            startingIndex = draggable.ref.parentElement.id;
            let legalMoves = board.findLegalMoves(board);
            let legalPieceMoves = [];
        
            for(let i = 0; i < legalMoves.length; i++){
                if(legalMoves[i].start == startingIndex){
                    legalPieceMoves.push(legalMoves[i].end);
                }
            }
            draggable.data.legalPieceMoves = legalPieceMoves;
        }, draggable);
    
        onDragEnd(async (e: any) => {
            if(e === null) return;
            e.occupied = false;
            // console.log(e);


            await delay(1);
            let oppositeColor;
            if(!e.ref.children[0]) return;
            // console.log(e.ref.children[0].id);
            // console.log(draggable.id)
            // console.log(draggable.ref.parentElement.id);
            // console.log(e.occupied)
            if(e.ref.children[0].id === draggable.id){
                endingIndex = draggable.ref.parentElement.id;
                if(endingIndex === startingIndex) return;
                // console.log("legal move");
                board.movePiece(startingIndex, endingIndex);
                board.displayBoard();
            }
            
        }, draggable);
    
        return (
        <section
            ref={draggable.ref}
            class={className}
            id={id}
        >
            <div class=""> </div>

        </section>
        );
  };

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  return (
    <Droppable 
        className={className}
        draggable={
        <Draggable
             className={`${pieceClassName != " " ? pieceClassName + " piece" : ""}`}
             id={draggableId}
        />}
        id={id}
        
    />
  )
}

export default ChessSquare