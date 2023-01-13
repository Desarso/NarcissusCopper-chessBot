import {
  Accessor,
  Setter,
  createContext,
  useContext,
  createSignal,
  onMount,
} from "solid-js";

interface ContextProps {
  onDragStart: Function;
  onDragEnd: Function;
  createDraggable: Function;
}

interface Draggable {
  id: string;
  startingPosition: { x: number; y: number };
  dragStart: Function;
  dragEnd: Function;
  ref: any;
}

interface Droppable {
  id: string;
  startingPosition: { x: number; y: number };
  dragStart: Function;
  dragEnd: Function;
  ref: any;
}

//I need a drag start assignable function for both draggable and droppable

const DragDropContext = createContext<ContextProps>();

export function DragDropContextProvider(props: any) {
  //here we are keeping track of some of the global states
  //so we need a function to createDraggable, this function should
  const [count, setCount] = createSignal(0);
  const [pageName, setPageName] = createSignal("Home");
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  const [startingMousePosition, setStartingMousePosition] = createSignal({
    x: 0,
    y: 0,
  });
  const [cursorDown, setCursorDown] = createSignal(false);
  const [target, setTarget] = createSignal({});
  const [previousPosition, setPreviousPosition] = createSignal({ x: 0, y: 0 });

  //global dran and drop event listeners
  //click down is not global since they are specific to elements only.
  onMount(() => {
    document.addEventListener("mousemove", (e) => {
      //this are general functions, I need to specify them.
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (cursorDown() && target()) {
        target().ref.style.transform = `translate(${
          mousePosition().x - startingMousePosition().x + previousPosition().x
        }px, ${
          mousePosition().y - startingMousePosition().y + previousPosition().y
        }px)`;
        // console.log("starting mouse position: ", startingMousePosition());
        // console.log("previous position: ", previousPosition());
      }
    });
    document.addEventListener("mouseup", () => {
      target().dragEnd();
    //   console.log("mouse up");
    //   console.log("target", target());
      if (target()?.ref) {
        target().ref.style.transform = `translate(${0}px, ${0}px)`;
      }
      setCursorDown(false);
      setTarget(null);
    });
  });

  //injection function
  const onDragStart = (callback: any, draggable: Draggable) => {
    if (draggable !== undefined) {
      draggable.dragStart = callback;
    }
  };
  //injection function
  const onDragEnd = (callback: Function, draggable: Draggable) => {
    if (draggable !== undefined) {
      draggable.dragEnd = callback;
    }
  };

  function getPreviousPosition(style: string) {
    if (style === null) return { x: 0, y: 0 };
    // console.log("this is the function input", style)
    let ass = style.split("translate(")[0];
    let position;
    if (ass) {
      position = style.split("translate(")[1].split(")")[0].split("px, ");
    }
    return { x: parseInt(position[0]), y: parseInt(position[1]) };
  }

  const createDraggable = (id: string) => {
    let draggable: Draggable = {
      id: id,
      startingPosition: { x: 0, y: 0 },
      dragStart: () => {},
      dragEnd: () => {},
      ref: null,
    };

    onMount(() => {
    //   draggable.ref.addEventListener("mouseup", () => {
    //     draggable.dragEnd();
    //     setTarget(null);
    //     setCursorDown(false);
    //     draggable.ref.style.transform = `translate(${0}px, ${0}px)`;
    //     console.log("dragEnd");
    //   });
      draggable.ref.addEventListener("mousedown", (e : any) => {
          draggable.dragStart();
          setPreviousPosition(getPreviousPosition(e.target.getAttribute("style")));
          setStartingMousePosition({x: e.clientX, y: e.clientY});
          setCursorDown(true);
          setTarget(draggable);
          });
    });

    return draggable;
  };

  return (
    <DragDropContext.Provider
      value={{ onDragEnd, onDragStart, createDraggable }}
    >
      {props.children}
    </DragDropContext.Provider>
  );
}

export const useDragDropContext = () => useContext(DragDropContext)!;
