import { Accessor, Setter, createContext, useContext, createSignal, onMount } from 'solid-js'

interface ContextProps {
    onDragStart: Setter<any>,
    onDragEnd: Setter<any>,
    createDraggable: Function,

}


interface Draggable  {
    id: string,
    currentPosition : {x: number, y: number},
    dragStart: Function,
    dragEnd: Function,
    ref: any
}

interface Droppable  {
    id: string,
    currentPosition : {x: number, y: number},
    dragStart: Function,
    dragEnd: Function,
    ref: any
}





//I need a drag start assignable function for both draggable and droppable

const DragDropContext = createContext<ContextProps>();




export function DragDropContextProvider(props: any) {

    //here we are keeping track of some of the global states
    //so we need a function to createDraggable, this function should 
    const [count, setCount] = createSignal(0);
    const [pageName, setPageName] = createSignal("Home");
    const [mousePosition, setMousePosition] = createSignal({x: 0, y: 0});
    const [startingMousePosition, setStartingMousePosition] = createSignal({x: 0, y: 0});
    const [cursorDown, setCursorDown] = createSignal(false);
    const [target, setTarget] = createSignal(null);
    const [previousPosition, setPreviousPosition] = createSignal({x: 0, y: 0});


    //we only want to move the element if they have a custom drag start function.
    //on mousemove we are tracking the mouse movement, and it is easy to update the position from that function
    //what instead I can do is call a function on mouse down, that sets an interval,
    //that updates draggable position, until mouse up is called.


    onMount(() => {
        document.addEventListener("mousemove", (e) => {
            //this are general functions, I need to specify them.
            setMousePosition({x: e.clientX, y: e.clientY});
            if(cursorDown()){
                target().style.transform = `translate(${mousePosition().x - startingMousePosition().x + previousPosition().x}px, ${mousePosition().y - startingMousePosition().y + previousPosition().y}px)`;
                // console.log("starting mouse position: ", startingMousePosition());
                // console.log("previous position: ", previousPosition());
            }
        });
    });
    
    //injection function
    const onDragStart = (callback: any, draggable: Draggable) => {
        if(draggable){
            draggable.dragStart = callback;
            onMount(() => {
                draggable.ref.addEventListener("mousedown", () => {
                setCursorDown(true);
                setTarget(draggable.ref);
                console.log("clicked");
                });
                draggable.ref.addEventListener("mouseup", () => {
                    setTarget(null);
                    setCursorDown(false);
                    console.log("dragEnd");
                    });
            })
        }
    }
    //injection function
    const onDragEnd = (callback: Function, draggable: Draggable) => {
        if(draggable!== undefined){
            draggable.dragEnd = callback;
            onMount(() => {
                draggable.ref.addEventListener("mouseup", () => {
                setTarget(null);
                setCursorDown(false);
                console.log("dragEnd");
                });
            })
        }
    }

    function getPreviousPosition(style: string){
        if(style === null) return {x: 0, y: 0};
        // console.log("this is the function input", style)
        let ass = style.split("translate(")[0];
        let position;
        if(ass){
            position = style.split("translate(")[1].split(")")[0].split("px, ");
        }
        return {x: parseInt(position[0]), y: parseInt(position[1])};
    }
   

    //I need to pass the function a droppable or draggable object
    //this object will then be used to asign the functions that go off with observers
    //to their respective elements.



    // onDragEnd(({draggable} : any) =>{
    //     console.log("drag End");
    // });

    const createDraggable = (id: string) => {
        let draggable: Draggable = {
            id: id,
            currentPosition: {x: 0, y: 0},
            dragStart: () => {
                
            },
            dragEnd: () => {
            },
            ref: null
        }
    
    
    
        return draggable;
    }





    //what we need is a signal that keeps track of this thing that is a function that gets fired when onDragStart is fired

    return (
        <DragDropContext.Provider value={{onDragEnd, onDragStart, createDraggable}}>
            {props.children}
        </DragDropContext.Provider>
    )
}

export const useDragDropContext = () => useContext(DragDropContext)!;



// function DragDropContext({}: Props) {
//   return (
//     <div>DragDropContext</div>
//   )
// }

// export default DragDropContext