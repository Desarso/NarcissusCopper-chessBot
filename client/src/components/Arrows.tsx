import { Accessor, createSignal, onMount } from "solid-js";
import { updateMove } from "../Classes/Types";
import MoveSound from "../Soundfiles/move-self.mp3";
import { Move } from "../Classes/chessClasses";

type Props = {
  moves: Accessor<updateMove[]>;
};

function Arrows({ moves }: Props) {
  const [moveIndex, setMoveIndex] = createSignal(-1);
  const moveSound = new Audio(MoveSound);
  let forwardClick = false;
  let backwardClick = false;
  let blockForward = false;
  let blockBackward = false;

  onMount(() => {
    document.addEventListener("boardUpdated", (e) => {
      setMoveIndex(moves().length - 1);
    });
  });

  async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function executeMoveInReverse(
    move: updateMove,
    singleMove: boolean = true
  ) {
    let UIPiece = document.getElementById(move.to)?.querySelector(".piece");
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
    if (!UIPiece) return;
    for (let i = 0; i < magnitude; i++) {
      UIPiece.style.transform = `translate(${normalized.x * i}px, ${
        normalized.y * i
      }px)`;
      if (i % 5 === 0 && singleMove) {
        await sleep(0.001);
      } else if (i % 25 === 0) {
        await sleep(0.001);
      }
    }
    previousSquare?.appendChild(UIPiece);
    if (move.atePiece && !move.enPassant) {
      let newPiece = document.createElement("section");
      newPiece.classList.add("piece");
      if (move.turnColor === "black") {
        newPiece.classList.add(move.atePiece.toUpperCase());
      } else {
        newPiece.classList.add(move.atePiece.toLowerCase());
      }
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
    moveSound.play();
  }

  async function executeMove(move: updateMove, singleMove: boolean = true) {
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
      for (let i = 0; i < magnitude; i++) {
        UIPiece.style.transform = `translate(${normalized.x * i}px, ${
          normalized.y * i
        }px)`;
        if (i % 5 === 0 && singleMove) {
          await sleep(0.001);
        } else if (i % 25 === 0) {
          await sleep(0.001);
        }
      }
      if (previousSquare?.querySelector(".piece")) {
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
  }
  async function goBackOneMove(singleMove: boolean = true) {
    blockBackward = true;
    if (moves().length === 0) {
      blockBackward = false;
      return;
    }
    if (moveIndex() === -1) {
      blockBackward = false;
      return;
    }
    //first thing we do is we undo a move;
    //then we set the move index to the previous move
    await executeMoveInReverse(moves()[moveIndex()], singleMove);
    if (moves()[moveIndex()].castle) {
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
    blockBackward = false;
  }
  async function goForwardOneMove(singleMove: boolean = true) {
    blockForward = true;
    if (moves().length === 0) {
      blockForward = false;
      return;
    }
    if (moveIndex() === moves().length - 1) {
      blockForward = false;
      return;
    }
    await executeMove(moves()[moveIndex() + 1], singleMove);
    setMoveIndex(moveIndex() + 1);

    if (moves()[moveIndex()].castle) {
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
    blockForward = false;
  }
  async function goForwardToLastMove() {
    for (let i = moveIndex(); i < moves().length - 1; i++) {
      await goForwardOneMove(false);
    }
  }
  return (
    <div class="arrows">
      <button
        onClick={async () => {
          await goBackToFirstMove();
        }}
      >
        {"<<"}&nbsp;
      </button>
      <button
        onClick={async () => {
          blockBackward ? null : goBackOneMove();
        }}
      >
        {"<"}
      </button>
      &nbsp;
      <button
        onClick={async () => {
          blockForward ? null : goForwardOneMove();
        }}
      >
        {">"}
      </button>
      <button
        onClick={async () => {
          await goForwardToLastMove();
        }}
      >
        &nbsp;{">>"}
      </button>
    </div>
  );
}

export default Arrows;
