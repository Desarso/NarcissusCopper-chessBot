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
  createDroppable: Function;
  onHoverOver: Function
  onHoverOut: Function
}

interface Draggable {
  id: string;
  startingPosition: { x: number; y: number };
  dragStart: Function;
  dragEnd: Function;
  ref: any;
  rectangle: any
}

interface Droppable {
  id: string;
  startingPosition: { x: number; y: number };
  hoverOver: Function;
  hoverOut: Function;
  ref: any;
  rectangle: any;
  hovering: boolean;
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
  const [droppables, setDropables] = createSignal([] as Droppable[]);
  const [cursorDown, setCursorDown] = createSignal(false);
  const [target, setTarget] = createSignal(null);
  const [previousTarget, setPreviousTarget] = createSignal(null);
  const [previousPosition, setPreviousPosition] = createSignal({ x: 0, y: 0 });

  //global dran and drop event listeners
  //click down is not global since they are specific to elements only.
  onMount(() => {
    document.addEventListener("pointermove", (e) => {
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
        target().rectangle = target().ref.getBoundingClientRect();
        // console.log(target().rectangle)

      }
    });
    document.addEventListener("pointerup", () => {
      if (target() == null) return;
      target().dragEnd();
    //   console.log("mouse up");
    //   console.log("target", target());
      if (target()?.ref) {
        target().ref.style.transform = `translate(${0}px, ${0}px)`;
        target().ref.getAttribute('style');
        // console.log(target().ref.style)
      }
      setCursorDown(false);
      setPreviousTarget(target());
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

  const onHoverOver = (callback: Function, droppable: Droppable) => {
    if(droppable !== undefined){
        droppable.hoverOver = callback;
    }
  }
  const onHoverOut = (callback: Function, droppable: Droppable) => {
    if(droppable !== undefined){
        droppable.hoverOut = callback;
    }
  }

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
      rectangle: null
    };
    onMount(() => {
    //   draggable.ref.addEventListener("mouseup", () => {
    //     draggable.dragEnd();
    //     setTarget(null);
    //     setCursorDown(false);
    //     draggable.ref.style.transform = `translate(${0}px, ${0}px)`;
    //     console.log("dragEnd");
    //   });
      draggable.ref.addEventListener("pointerdown", (e : any) => {
          draggable.dragStart();
          setPreviousPosition(getPreviousPosition(e.target.getAttribute("style")));
          setStartingMousePosition({x: e.clientX, y: e.clientY});
          setCursorDown(true);
          setTarget(draggable);
          draggable.rectangle = draggable.ref.getBoundingClientRect();
          });
    });

    return draggable;
  };

  const createDroppable = (id: string) => {
    let droppable: Droppable = {
      id: id,
      startingPosition: { x: 0, y: 0 },
      hoverOver: () => {},
      hoverOut: () => {},
      ref: null,
      rectangle: null,
      hovering: false
    }
    //how do we know when something is hovering over?
    //the draggable needs to send a message to the droppable
    setDropables([...droppables(), droppable]);

    onMount(() => {
      droppable.rectangle = droppable.ref.getBoundingClientRect();
      document.addEventListener("pointermove", () => {
        if(target() == null) return;
        if (target().rectangle == null) return;
          let rect1 = target().ref.getBoundingClientRect();
          let rect2 = droppable.ref.getBoundingClientRect();
          if (rect1.top > rect2.bottom ||
              rect1.right < rect2.left ||
              rect1.bottom < rect2.top ||
              rect1.left > rect2.right
                ) {
                  if(!droppable.hovering) return;
                  droppable.hovering = false;
                  droppable.hoverOut(target());
                } else {
                  if(droppable.hovering) return;
                  droppable.hovering = true;
                  droppable.hoverOver(target());
                }
          

      });
      document.addEventListener("pointerup", () => {
        if(!droppable.hovering) return;
        droppable.hovering = false;
        droppable.hoverOut(previousTarget());
        if(previousTarget() == null) return;
        droppable.ref.appendChild(previousTarget().ref);
          

      });
    });
    return droppables()[droppables().length - 1];
 }

  return (
    <DragDropContext.Provider
      value={{ onDragEnd, onDragStart, createDraggable, onHoverOver, createDroppable, onHoverOut }}
    >
      {props.children}
    </DragDropContext.Provider>
  );
}

export const useDragDropContext = () => useContext(DragDropContext)!;
