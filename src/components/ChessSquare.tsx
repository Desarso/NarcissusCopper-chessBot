import { Show } from "solid-js";
import { className } from "solid-js/web";
import { useDragDropContext } from "./DragDropContext";


type Props = {
    pieceClassName : string,
    className : string,
    id : string
}


    const Droppable = ({ id, className, draggable, draggableClass} : any) => {
        const { onHoverOver, createDroppable, onHoverOut } = useDragDropContext();
        const droppable = createDroppable(id);
    
        onHoverOver((e: any) => {
        // console.log("hover over");
        // console.log(e);
        droppable.ref.classList.add("hovered");
    
        }, droppable);
    
        onHoverOut((e: any) => {
        // console.log("hover out");
        droppable.ref.classList.remove("hovered");
        }, droppable);
    
       if(draggable().getAttribute('class').length === 0){
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

    const Draggable = ({className }: any) => {
        const { onDragStart, onDragEnd, createDraggable } = useDragDropContext();
        const draggable = createDraggable();
    
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

function ChessSquare({pieceClassName, className, id}: Props) {
  return (
    <Droppable 
        className={className}
        draggable={
        <Draggable
             className={`${pieceClassName != " " ? pieceClassName + " piece" : ""}`} 
        />}
        id={id}
        
    />
  )
}

export default ChessSquare