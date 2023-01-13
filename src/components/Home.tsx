
import { onMount } from 'solid-js';
import { useDragDropContext } from './DragDropContext'

type Props = {}


const Draggable = ({id}: any) => {
  const { onDragStart, onDragEnd, createDraggable} = useDragDropContext();
    const draggable = createDraggable(id);

    onDragStart(() =>{
       console.log("drag Start");
  }, draggable);

  onDragEnd(() =>{
      console.log("drag End");
  }, draggable);



  return (
      <div class='draggable'
      ref={draggable.ref}
      >
          Hi there
      </div>
  )
}

function Home({}: Props) {


  return (
    <>
      <div class="dropZone">
        <Draggable id={"randomId"}/>
      </div>
      <div class="dropZone">

      </div>    
    </>
  )
}

export default Home


