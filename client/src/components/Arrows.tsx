import { Accessor, createSignal, onMount, Setter } from "solid-js";
import { updateMove } from "../Classes/Types";
import MoveSound from "../Soundfiles/move-self.mp3";
import { Board, Move } from "../Classes/chessClasses";
import { useDragDropContext } from "./DragDropContext";
import { all } from "axios";

type Props = {
  allPieces: Accessor<HTMLElement[]>;
  setAllPieces: Setter<HTMLElement[]>;
  board: Accessor<Board>;
};

class CrownedPiece {
  ID: string;
  crownedTo: string;
  constructor(ID: string, crownedTo: string) {
    this.ID = ID;
    this.crownedTo = crownedTo;
  }
}

function Arrows({board }: Props) {

  let possiblePieces: HTMLElement[] = []

  function positionArrows() {
    let windowHeight = window.innerHeight;
    let arrows = document.querySelector(".arrows");
    // let arrowsRect = arrows.getBoundingClientRect();
    let board = document.querySelector(".chessBoard");
    let boardRect = board.getBoundingClientRect();
    let boardHeight = boardRect.height;
    let userNameWidget = document.querySelector(".userNameWidgetHolder");
    let userNameWidgetRect = userNameWidget.getBoundingClientRect();
    let userHeight = userNameWidgetRect.height;
    let z = boardHeight + userHeight * 2;
    let x = (windowHeight - z) / 2 + z;
    arrows.style.top = `${x}px`;
  }

  const [moveIndex, setMoveIndex] = createSignal(-1);
  const [crownedPieces, setCrownedPieces] = createSignal<CrownedPiece[]>([]);
  const moveSound = new Audio(MoveSound);
  let forwardClick = false;
  let block = false;

  onMount(() => {
    possiblePieces = [...allPieces()];
    positionArrows();
    window.addEventListener("resize", () => {
      positionArrows();
    });
    document.addEventListener("boardUpdated", async (e) => {
      setMoveIndex(moves().length - 1);
      // await sleep(200);
      // setCrownedPiecesBackToNormal();
      block = false;
      possiblePieces = [...allPieces()];
      console.log(allPieces());
      console.log(possiblePieces);
      document.possiblePieces = possiblePieces;
      document.allPieces = allPieces;
    });
  
  });


  async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }



  async function executeMoveInReverse(
    move: updateMove,
    singleMove: boolean = true
  ) {
    console.log(allPieces());
    let UIPiece = document.getElementById(move.to)?.querySelector("section.piece");
    let currentSquare = document.getElementById(move.to);
    let previousSquare = document.getElementById(move.from);
    let currentSquareRect = currentSquare?.getBoundingClientRect();
    let currentCords = {
      x: currentSquareRect?.x + currentSquareRect?.width / 2,
      y: currentSquareRect?.y + currentSquareRect?.height / 2,
    };
    let prevSquareRect = previousSquare?.getBoundingClientRect();
    let prevCords = {
      x: prevSquareRect?.x + prevSquareRect?.width / 2,
      y: prevSquareRect?.y + prevSquareRect?.height / 2,
    };

    //with this we can get a unit vector for the direction in which we need to go
    let vector = {
      x: prevCords.x - currentCords.x,
      y: prevCords.y - currentCords.y,
    };
    let magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    let normalized = { x: vector.x / magnitude, y: vector.y / magnitude };

    if (!UIPiece) {
      return;
    };
    for (let i = 0; i < magnitude; i++) {
      UIPiece.style.transform = `translate(${normalized.x * i}px, ${
        normalized.y * i
      }px)`;
      if (i % 20 === 0 && singleMove) {
        await sleep(0.001);
      } else if (i % 200 === 0) {
        await sleep(0.001);
      }
    }
    console.log("in reverse move function", move);
    if (move.crowning) {
      UIPiece.classList.remove(move.crownedTo);
      if (move.turnColor === "white") {
        UIPiece.classList.add("P");
      } else {
        UIPiece.classList.add("p");
      }
      let newCrownedPiece = new CrownedPiece(UIPiece.id, move.crownedTo);
      setCrownedPieces([...crownedPieces(), newCrownedPiece]);
    }

    previousSquare?.appendChild(UIPiece);
    //don't create a piece
    if (move.atePiece != "" && !move.enPassant) {

    let pieceType = move.atePiece;
    if(move.turnColor === "white") pieceType = pieceType.toLowerCase();
    if(move.turnColor === "black") pieceType = pieceType.toUpperCase();
    let newPiece;
      for(let i = 0; i < possiblePieces.length; i++){
          if(possiblePieces[i].classList.contains(pieceType)){
            newPiece = possiblePieces[i];
            possiblePieces.splice(i, 1);
            break;
          }
      } 
      // if(!newPiece && move.crowning) {
      //   for(let i = 0; i < possiblePieces.length; i++){
      //     if(possiblePieces[i].classList.contains('p') && move.turnColor === "black"){
      //       newPiece = possiblePieces[i];
      //       possiblePieces.splice(i, 1);
      //       break;
      //     }else if(possiblePieces[i].classList.contains('P') && move.turnColor === "white"){
      //       newPiece = possiblePieces[i];
      //       possiblePieces.splice(i, 1);
      //       break;
      //     }
      //   }
      // }

      // console.log(allPieces());
      // console.log(possiblePieces);
      if (!newPiece) {
        UIPiece.style.transform = `translate(0.1px, 0.1px)`;
        console.log("could not find piece");
        console.log(possiblePieces);
        return;
      };
      currentSquare?.appendChild(newPiece);
    }
    UIPiece.style.transform = `translate(0.1px, 0.1px)`;
    if (move.enPassant) {
      let enPassantPiece = document.createElement("section");
      enPassantPiece.classList.add("piece");
      if (move.turnColor === "black") {
        enPassantPiece.classList.add(move.atePiece.toUpperCase());
      } else {
        enPassantPiece.classList.add(move.atePiece.toLowerCase());
      }
      document
        .getElementById(move.enPassantSquare)
        ?.appendChild(enPassantPiece);
    }

    if (singleMove) moveSound.play();
  }

  async function executeMove(
    move: updateMove,
    singleMove: boolean = true,
    instant: boolean = false
  ) {
    let lastMove = move;
    let allDroppables = document.querySelectorAll(".chessSquare");
    for (let i = 0; i < allDroppables.length; i++) {
      if (
        allDroppables[i].id === lastMove.from ||
        allDroppables[i].id === lastMove.to
      ) {
        allDroppables[i]?.classList?.add("lastMove");
      } else {
        allDroppables[i]?.classList?.remove("lastMove");
      }
    }

    let UIPiece = document.getElementById(move.from)?.querySelector(".piece");
    let currentSquare = document.getElementById(move.from);
    let previousSquare = document.getElementById(move.to);
    let currentSquareRect = currentSquare?.getBoundingClientRect();
    let currentCords = {
      x: currentSquareRect?.x + currentSquareRect?.width / 2,
      y: currentSquareRect?.y + currentSquareRect?.height / 2,
    };
    let prevSquareRect = previousSquare?.getBoundingClientRect();
    let prevCords = {
      x: prevSquareRect?.x + prevSquareRect?.width / 2,
      y: prevSquareRect?.y + prevSquareRect?.height / 2,
    };
    //with this we can get a unit vector for the direction in which we need to go
    let vector = {
      x: prevCords.x - currentCords.x,
      y: prevCords.y - currentCords.y,
    };
    let magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    let normalized = { x: vector.x / magnitude, y: vector.y / magnitude };
    try {
      
      if (move.crowning) {
        UIPiece.classList.remove("p");
        UIPiece.classList.remove("P");
        UIPiece.classList.add(move.crownedTo);
      }

      if (previousSquare?.querySelector(".piece")) {
        possiblePieces.push(previousSquare?.querySelector(".piece")!);
        previousSquare?.querySelector(".piece")?.remove();
      }

      previousSquare?.appendChild(UIPiece);
      UIPiece.style.transform = `translate(0.1px, 0.1px)`;
      if (move.enPassant) {
        let enPassantPiece = document
          .getElementById(move.enPassantSquare)
          ?.querySelector(".piece");
        enPassantPiece?.remove();
      }

      if (singleMove) moveSound.play();
    } catch (e) {
      console.log(e);
    }
  }

  async function goBackToFirstMove() {
    for (let i = moveIndex(); i > -1; i--) {
      await goBackOneMove(false);
    }
    moveSound.play();
  }
  async function goBackOneMove(singleMove: boolean = true) {
    block = true;
    if (board().length === 0) {
      block = false;
      return;
    }
    if (moveIndex() === -1) {
      block = false;
      return;
    }
    //first thing we do is we undo a move;
    //then we set the move index to the previous move
    await executeMoveInReverse(moves()[moveIndex()], singleMove);
    let lastMove = moves()[moveIndex() - 1];
    if (lastMove != undefined) {
      let allDroppables = document.querySelectorAll(".chessSquare");
      for (let i = 0; i < allDroppables.length; i++) {
        if (
          allDroppables[i].id === lastMove.from ||
          allDroppables[i].id === lastMove.to
        ) {
          allDroppables[i]?.classList?.add("lastMove");
        } else {
          allDroppables[i]?.classList?.remove("lastMove");
        }
      }
    } else {
      let allDroppables = document.querySelectorAll(".chessSquare");
      for (let i = 0; i < allDroppables.length; i++) {
        allDroppables[i]?.classList?.remove("lastMove");
      }
    }

    if (moves()[moveIndex()]?.castle) {
      let to = moves()[moveIndex()].to;
      let rockUIPiece;
      switch (to) {
        case "g1":
          rockUIPiece = document.getElementById("f1")?.querySelector(".piece");
          document.getElementById("h1")?.appendChild(rockUIPiece);
          break;
        case "c1":
          rockUIPiece = document.getElementById("d1")?.querySelector(".piece");
          document.getElementById("a1")?.appendChild(rockUIPiece);
          break;
        case "g8":
          rockUIPiece = document.getElementById("f8")?.querySelector(".piece");
          document.getElementById("h8")?.appendChild(rockUIPiece);
          break;
        case "c8":
          rockUIPiece = document.getElementById("d8")?.querySelector(".piece");
          document.getElementById("a8")?.appendChild(rockUIPiece);
      }
    }
    setMoveIndex(moveIndex() - 1);
    block = false;
  }
  async function goForwardOneMove(
    singleMove: boolean = true,
    instant: boolean = false
  ) {
    block = true;
    if (moves().length === 0) {
      block = false;
      return;
    }
    if (moveIndex() === moves().length - 1) {
      block = false;
      return;
    }
    await executeMove(moves()[moveIndex() + 1], singleMove, instant);
    setMoveIndex(moveIndex() + 1);

    if (moves()[moveIndex()]?.castle) {
      let to = moves()[moveIndex()].to;
      let rockUIPiece;
      switch (to) {
        case "g1":
          rockUIPiece = document.getElementById("h1")?.querySelector(".piece");
          document.getElementById("f1")?.appendChild(rockUIPiece);
          break;
        case "c1":
          rockUIPiece = document.getElementById("a1")?.querySelector(".piece");
          document.getElementById("d1")?.appendChild(rockUIPiece);
          break;
        case "g8":
          rockUIPiece = document.getElementById("h8")?.querySelector(".piece");
          document.getElementById("f8")?.appendChild(rockUIPiece);
          break;
        case "c8":
          rockUIPiece = document.getElementById("a8")?.querySelector(".piece");
          document.getElementById("d8")?.appendChild(rockUIPiece);
      }
    }
    block = false;
  }
  async function goForwardToLastMove(instant: boolean = false) {
    for (let i = moveIndex(); i < moves().length - 1; i++) {
      await goForwardOneMove(false, instant);
    }
    moveSound.play();
  }
  return (
    <div class="arrows">
      <div
        onClick={async () => {
          block === false ? goBackToFirstMove() : null;
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-7 h-7"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
          />
        </svg>
      </div>
      <div
        onClick={async () => {
          block === false ? goBackOneMove() : null;
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-7 h-7"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </div>
      <div
        onClick={async () => {
          block === false ? goForwardOneMove() : null;
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-7 h-7"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
      <div
        onClick={async () => {
          block === false ? goForwardToLastMove() : null;
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-7 h-7"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    </div>
  );
}

export default Arrows;
