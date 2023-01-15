import { onMount, Show } from "solid-js";
import { useDragDropContext } from "./DragDropContext";

type Props = {};

const Draggable = ({ id }: any) => {
  const { onDragStart, onDragEnd, createDraggable } = useDragDropContext();
  const draggable = createDraggable(id);

  onDragStart(() => {
    // console.log("drag Start");
  }, draggable);

  onDragEnd(() => {
    // console.log("drag End");
  }, draggable);

  return (
    <div class="flex justify-center w-[120px]" ref={draggable.ref}>
      <div class="w-max text-md hover:scale-110 text-gray-800 font-bold draggable m-0 transform transition">
        Hi there
      </div>
      
    </div>
  );
};

const ChessSquare = ({ id, className, draggable} : any) => {
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
    class="dropZone"
    ref={droppable.ref}
    >
    <Show when={draggable != undefined}>
      <Draggable id={id} />
    </Show>
    </div>
  )

}

function Home({}: Props) {

  return (
    <>
      <ChessSquare 
      id= {"zfasdsfdsa"}
      draggable={<Draggable id={"sdfgag"} />}
      >
      </ChessSquare>
      <ChessSquare id={"randomId2"} />
    </>
  );
}

export default Home;
