
import { useDragDropContext, createDraggable } from './DragDropContext'

type Props = {}


const Draggable = ({id}: any) => {
    const draggable = createDraggable(id);


  return (
      <div class='draggable'
      >
          Hi there
      </div>
  )
}

function Home({}: Props) {
    const { count, setCount, pageName, setPageName } = useDragDropContext();



  return (
    <div>
        <Draggable/>
    </div>
  )
}

export default Home


