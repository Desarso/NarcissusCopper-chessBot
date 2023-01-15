import { Show } from "solid-js";
import { className } from "solid-js/web";
import { useDragDropContext } from "./DragDropContext";


type Props = {
    pieceClassName : string,
    className : string,
}


    const Droppable = ({ id, className, draggable, draggableClass} : any) => {
        const { onHoverOver, createDroppable, onHoverOut } = useDragDropContext();
        const droppable = createDroppable(id);
    
        onHoverOver((e: any) => {
        // console.log("hover over");
        // console.log(e);
        droppable.ref.style.boxShadow = "inset 0px 0px 20px 20px rgba(0,0,0,0.3)";
    
        }, droppable);
    
        onHoverOut((e: any) => {
        // console.log("hover out");
        droppable.ref.style.boxShadow = "none";
        }, droppable);
    
        let variable = "";
    
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

    const Draggable = ({ id, className }: any) => {
        const { onDragStart, onDragEnd, createDraggable } = useDragDropContext();
        const draggable = createDraggable(id);
    
        onDragStart(() => {
        // console.log("drag Start");
        }, draggable);
    
        onDragEnd(() => {
        // console.log("drag End");
        }, draggable);
    
        return (
        <section
            ref={draggable.ref}
            class={className}
        >

        </section>
        );
  };

function ChessSquare({pieceClassName, className}: Props) {
  return (
    <Droppable 
        className={className}
        draggable={
        <Draggable
             id="1" 
             className={`${pieceClassName != " " ? pieceClassName + " piece" : ""}`} 
        />}
        
    />
  )
}

export default ChessSquare