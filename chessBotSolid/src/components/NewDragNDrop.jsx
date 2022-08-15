
  import interact from 'interactjs';


  
  export const NewDragNDrop = () => {

    const position = { x: 0, y: 0 }

    interact('.draggable123').draggable({
    listeners: {
        start (event) {
        // console.log(event.type, event.target)
        },
        move (event) {
        position.x += event.dx
        position.y += event.dy

        event.target.style.transform =
            `translate(${position.x}px, ${position.y}px)`
        },
    }
    })

  
  
    return (
    
        <div class="draggable123">
            Draggable
        </div>
    );
  };