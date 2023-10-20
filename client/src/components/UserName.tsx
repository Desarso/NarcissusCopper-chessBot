import { Accessor, onMount, Setter } from "solid-js";
import { User, updateMove } from "../Classes/Types";
import CatLogo from "./CatLogo";
import ScoreNPieces from "./ScoreNPieces";
import { Board } from "../Classes/chessClasses";
import Arrows from "./Arrows";

type Props = {
  user: Accessor<User>;
  color: string;
  board: Accessor<Board>;
  moves: Accessor<updateMove[]>;
  allPieces: Accessor<HTMLElement[]>;
  setAllPieces: Setter<HTMLElement[]>;
};

function UserName({ user, color, board, moves, allPieces, setAllPieces }: Props) {
  function positionWidget() {
    let chessboard = document.querySelector(".chessBoard");
    let chessboardRect = chessboard.getBoundingClientRect();
    let height = chessboardRect.height;
    let windowHeight = window.innerHeight;
    let userNameWidget = document.querySelector(".userNameWidgetHolder.user");
    let userNameWidgetRect = userNameWidget.getBoundingClientRect();
    userNameWidget.style.top = `${
      height + ((windowHeight - height) / 2)
    }px`;
  }

  onMount(() => {
    positionWidget();
    window.addEventListener("resize", () => {
      positionWidget();
    });
  });

  return (
    <>
    <div class="userNameWidgetHolder user">
      <div class="userNameWidget">
        <div class="userName">
          {user()?.username || "404 not found"}
        </div>
      
        <CatLogo
          catLink={
            user()?.CatUrl
              ? user()?.CatUrl
              : "https://cdn2.thecatapi.com/images/dt5.jpg"
          }
        />
      </div>
      <ScoreNPieces color={color} board={board} />
    </div>
    <Arrows board={board} allPieces={allPieces} setAllPieces={setAllPieces}/>
    </>
    
  );
}

export default UserName;
