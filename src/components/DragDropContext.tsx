import { Accessor, Setter, createContext, useContext, createSignal, onMount } from 'solid-js'

interface ContextProps {
    count : Accessor<number>,
    setCount : Setter<number>
    pageName : Accessor<string>,
    setPageName : Setter<string>
}

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
    const [previousPosition, setPreviousPosition] = createSignal();
    let dragStart: any;
    let dragEnd: any;

    const onDragStart = (callback: Function) => {
        dragStart = callback;
    }

    const onDragEnd = (callback: Function) => {
        dragEnd = callback;
    }



    onMount(() => {
        document.addEventListener("mousemove", (e) => {
            setMousePosition({x: e.clientX, y: e.clientY});
            if(cursorDown()){
                e.target.style.transform = `translate(${mousePosition().x - startingMousePosition().x + previousPosition().x}px, ${mousePosition().y - startingMousePosition().y + previousPosition().y}px)`;
                console.log("mouse position: ", mousePosition());
                console.log("starting mouse position: ", startingMousePosition());
                console.log("previous position: ", previousPosition());
            }
        });
        document.addEventListener("mousedown", (e) => {
            setStartingMousePosition({x: e.clientX, y: e.clientY});
            console.log(startingMousePosition())
            setCursorDown(true);
            console.log(e.target);
            let previousPosition = getPreviousPosition(e.target.getAttribute("style"));
            setPreviousPosition(previousPosition);
            // console.log("previous position: ", previousPosition);
            // console.log(e.target.getAttribute("style"))
            setTarget(e.target);
            dragStart();
        });
        document.addEventListener("mouseup", (e) => {
            setCursorDown(false);
            dragEnd();
            // console.log("cursor down: ", cursorDown());
        });

    });

    function getPreviousPosition(style: string){
        if(style === null) return {x: 0, y: 0};
        console.log("this is the function input", style)
        let ass = style.split("translate(")[0];
        let position;
        if(ass){
            position = style.split("translate(")[1].split(")")[0].split("px, ");
        }
        return {x: parseInt(position[0]), y: parseInt(position[1])};
    }

    onDragStart(() =>{
        console.log("drag Start");
    });

    onDragEnd(() =>{
        console.log("drag End");
    });





    //what we need is a signal that keeps track of this thing that is a function that gets fired when onDragStart is fired

    return (
        <DragDropContext.Provider value={{count, setCount, pageName, setPageName}}>
            {props.children}
        </DragDropContext.Provider>
    )
}

export const useDragDropContext = () => useContext(DragDropContext)!;

export const createDraggable = (id: string) => {

}

// function DragDropContext({}: Props) {
//   return (
//     <div>DragDropContext</div>
//   )
// }

// export default DragDropContext