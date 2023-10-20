import { Accessor, onMount } from "solid-js";
import { User, updateMove } from "../Classes/Types";
import CatLogo from "./CatLogo";
import ScoreNPieces from "./ScoreNPieces";
import { Board } from "../Classes/chessClasses";

type Props = {
  opponent: Accessor<User>;
  color: string;
  board: Accessor<Board>;
};

function OpponentName({opponent, color, board}: Props) {
  function positionWidget() {
    let chessboard = document.querySelector(".chessBoard");
    let chessboardRect = chessboard.getBoundingClientRect();
    let height = chessboardRect.height;
    let windowHeight = window.innerHeight;
    let userNameWidget = document.querySelector(".userNameWidgetHolder.opponent");
    let userNameWidgetRect = userNameWidget.getBoundingClientRect();
    let userHeight = userNameWidgetRect.height;
    userNameWidget.style.top = `${(windowHeight - height) / 2 - userHeight}px`;
  }

  onMount(() => {
    positionWidget();
    window.addEventListener("resize", () => {
      positionWidget();
    });
  });

  return (
    <>
        <div class="userNameWidgetHolder opponent">
      <div class="userNameWidget">
      <div class="userName">
          {opponent()?.username || "404 not found"}
        </div>
        <CatLogo catLink={opponent()?.CatUrl ? opponent()?.CatUrl : "https://cdn2.thecatapi.com/images/dt5.jpg"}/>
      </div>
      <ScoreNPieces
        color={color}
        board={board}
      />
     
    </div>
      
    </>
  );
}

export default OpponentName;
