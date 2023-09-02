import {
  createReaction,
  createResource,
  createSignal,
  onMount,
  Show,
  createEffect,
  onCleanup,
  from,
} from "solid-js";
import WhiteChessboard from "./WhiteChessboard";
import BlackChessboard from "./BlackChessboard";
import GlassOverlay from "./GlassOverlay";
import UsersList from "./UsersList";
import { Board, Move } from "../Classes/chessClasses";
import axios from "axios";
import MoveSound from "../Soundfiles/move-self.mp3";
import CaptureSound from "../Soundfiles/capture.mp3";
import BallsBackground from "./BallsBackground";
import { Position, PositionNotification, User, CreateGameNotification } from "../Classes/Types";
import { ChessWebSocket } from "../Classes/ChessWebSockets";

type Props = {};



//here I choose the color of board, but this is too soon, I need to create a pop up screen to choose a username
//that also checks for a username, in both session, and local storage. And, then requests the graphql to see if the user exisits,
//and if there are any active games, and if so, it will load the game. Otherwise, it will create the user, in the graphl, or update it.

function Home({}: Props) {
  const movePieceSound = new Audio(MoveSound);
  const capturePieceSound = new Audio(CaptureSound);
  const [board, setBoard] = createSignal<Board>(new Board());
  const [inGame, setInGame] = createSignal<boolean>(false);
  const [inGameColor, setInGameColor] = createSignal<string>("");
  const [gameId, setGameId] = createSignal<string>("");
  const [allPieces, setAllPieces]: any = createSignal([]);
  const [lastMove, setLastMove] = createSignal<Move>();
  const [checkmate, setCheckmate] = createSignal<boolean>(false);

  const [user, setUser] = createSignal<User>();
  const [users, setUsers] = createSignal<User[]>([]);
  const [inSession, setInSession] = createSignal<boolean>(false);
  const [notificationUser, setNotificationUser] = createSignal<
    User | undefined
  >();
  const [notificationData, setNotificationData] = createSignal(null);

  const chessWebSocket = new ChessWebSocket(user());


  onCleanup(() => {
    if (chessWebSocket.ws) {
      chessWebSocket.close();
    }
  });

  onMount(async () => {
    window.users = users;
    checkforUser();
    updatePosition();
    listenForUserUpdates();
    document.addEventListener("mousedown", (e) => onMouseDown(e));
    document.ws = chessWebSocket.ws;
  });

  function listenForUserUpdates() {
    document.addEventListener("usersUpdated", (event) => {
      let newUsers = event.data.filter((dataUser) => user().id != dataUser.id);
      setUsers([...newUsers]);
    });
    document.addEventListener("notification", (event) => {
      onNotificationReceived(event.data);
    });
    document.addEventListener("updateUser", (event) => {
      console.log("update user event received", event.data.CatUrl);
      let mainUser = document.querySelector("#mainUser");
      console.log(mainUser.querySelector(".catLogo"));

      mainUser.querySelector(".catLogo").style.backgroundImage = "nothing"
      // mainUser.querySelector(".catLogo").style.backgroundImage = `url("${event.data.CatUrl}");`;
    })
  }

  function updatePosition() {
    let index = 0;
    document.addEventListener("mousemove", (event) => {
      if (index % 5 != 0) {
        if (index == 100) {
          index = 0;
        }
        index++;
        return;
      }
      if (inGame() === false) return;
      let self = user();
      let other =
        notificationData().from.id == self.id
          ? notificationData().to
          : notificationData().from;
      let chessBoard = document.querySelector(".chessBoard");
      let chessBoardWidth = chessBoard.offsetWidth;
      let position = new Position(event.clientX, event.clientY);
      let positionNotification = new PositionNotification(
        self,
        other,
        position,
        chessBoardWidth
      );
      chessWebSocket.ws.send(JSON.stringify(positionNotification));
    });
  }

  function onMouseDown(mouseEvent: any) {
    // Check if the event is a double click
    if (mouseEvent.detail > 1) {
      mouseEvent.preventDefault(); // Prevent text selection for double clicks
    }
  }


  async function checkforUser() {
    //check for user in local storage
    //check for user in session storage
    //check for user in graphql
    let chessData = sessionStorage.getItem("gabrielmalek/chess.data");
    let chessDataJson = JSON.parse(chessData!);
    if (chessData == null) {
      console.log("session storage null");
    } else {
      console.log("session storage not null");
      let stringUser = new User(
        chessDataJson.id,
        chessDataJson.username,
        chessDataJson.CatUrl
      );
      setUser(stringUser);
      setInSession(true);
      chessWebSocket.beginPinging(user);
      
      console.log("should be pinging");
      return;
    }
    chessData = localStorage.getItem("gabrielmalek/chess.data");
    chessDataJson = JSON.parse(chessData!);
    if (chessData == null) {
      console.log("local storage null");
    } else {
      let newUser = new User(
        chessDataJson.id,
        chessDataJson.username,
        chessDataJson.CatUrl
      );
      if (newUser.username == "" || newUser.username == undefined) {
        return;
      }
      setUser(newUser);
      setInSession(false);
    }
  }

  function updateBoard() {
    //rip all pieces from board
    // //put em back

    let UIBoard = document.querySelectorAll(".chessSquare");

    let allUIPieces = document.querySelectorAll("section.piece");

    if (inGameColor() == "white") {
      for (let i = 0; i < allUIPieces.length; i++) {
        allUIPieces[i].remove();
      }
      let indexUsed: any = [];
      for (let i = 0; i < board().board.length; i++) {
        if (board().board[i] != " ") {
          for (let j = 0; j < allUIPieces.length; j++) {
            if (
              allUIPieces[j].classList.contains(board().board[i]) &&
              !indexUsed.includes(j)
            ) {
              UIBoard[i].appendChild(allUIPieces[j]);
              // console.log("found piece", allUIPieces[j]);
              indexUsed.push(j);
              break;
            }
          }
        }
      }

      //I double check that the board is correct
      for (let i = 0; i < board().board.length; i++) {
        let UIboardPiece = UIBoard[i]?.querySelector(".piece");
        if (UIboardPiece != undefined && board().board[i] != " ") {
          if (UIboardPiece.classList.contains(board().board[i])) {
            console.log("piece is correct");
          } else {
            console.log("something is funky");
            console.log("piece", UIboardPiece);
            console.log("board", board().board[i]);
            break;
          }
        } else if (UIboardPiece == undefined && board().board[i] != " ") {
          console.log("something is funky");
          console.log("piece", UIboardPiece);
          console.log("board", board().board[i]);
          for (let j = 0; j < allUIPieces.length; j++) {
            if (
              (allUIPieces[j].classList.contains("p") ||
                allUIPieces[j].classList.contains("P")) &&
              !indexUsed.includes(j)
            ) {
              console.log("found piece", allUIPieces[j]);
              let piece = allUIPieces[j];
              if (piece.classList.contains("p")) {
                piece.classList.remove("p");
                piece.classList.add(board().board[i]);
              } else {
                piece.classList.remove("P");
                piece.classList.add(board().board[i]);
              }
              UIBoard[i].appendChild(piece);
            }
          }
          break;
        }
      }
    } else if (inGameColor() == "black") {
      for (let i = 0; i < allUIPieces.length; i++) {
        allUIPieces[i].remove();
      }
      let indexUsed: any = [];
      let index = 0;
      for (let i = board().board.length - 1; i >= 0; i--) {
        if (board().board[i] != " ") {
          for (let j = 0; j < allUIPieces.length; j++) {
            if (
              allUIPieces[j].classList.contains(board().board[i]) &&
              !indexUsed.includes(j)
            ) {
              UIBoard[index].appendChild(allUIPieces[j]);
              // console.log("found piece", allUIPieces[j]);
              indexUsed.push(j);
              break;
            }
          }
        }
        index++;
      }
      //I double check that the board is correct
      index = 0;
      for (let i = board().board.length - 1; i >= 0; i--) {
        let UIboardPiece = UIBoard[index]?.querySelector(".piece");
        if (UIboardPiece != undefined && board().board[i] != " ") {
          if (UIboardPiece.classList.contains(board().board[i])) {
            // console.log("piece is correct");
          } else {
            // console.log("something is funky");
            // console.log("piece", UIboardPiece);
            // console.log("board", board().board[i]);
            break;
          }
        } else if (UIboardPiece == undefined && board().board[i] != " ") {
          // console.log("something is funky");
          // console.log("piece", UIboardPiece);
          // console.log("board", board().board[i]);
          for (let j = 0; j < allUIPieces.length; j++) {
            if (
              (allUIPieces[j].classList.contains("p") ||
                allUIPieces[j].classList.contains("P")) &&
              !indexUsed.includes(j)
            ) {
              // console.log("found piece", allUIPieces[j]);
              let piece = allUIPieces[j];
              if (piece.classList.contains("p")) {
                piece.classList.remove("p");
                piece.classList.add(board().board[i]);
              } else {
                piece.classList.remove("P");
                piece.classList.add(board().board[i]);
              }
              UIBoard[index].appendChild(piece);
            }
          }
          break;
        }
        index++;
      }
    }

    board().displayBoard();
  }

  function checkMateFunction() {
    //need to write this function
    //I must delete game from backend
    //and
  }

  async function updateAllBoards(result: any) {
    if (result === undefined) {
      console.log("updating boards");
      updateBoard();
      return;
    }

    console.log(result);
    let move =
      result.data.chessGamesSub.moves[
        result.data.chessGamesSub.moves.length - 1
      ];
    // console.log("new move", move);
    let newFen = result.data.chessGamesSub.fen;
    if (newFen != board().fen) {
      // await board().displayBoard();
      board().movePiece(move.from, move.to);
      //check new fen against old fen\
      syncFens(newFen);
      updateBoard();

      console.log(move);
      let lastMoveType = new Move(undefined, undefined, move.from, move.to);
      setLastMove(lastMoveType);
      let allDroppables = document.querySelectorAll(".chessSquare");
      for (let i = 0; i < allDroppables.length; i++) {
        if (
          allDroppables[i].id === lastMove()?.start ||
          allDroppables[i].id === lastMove()?.end
        ) {
          allDroppables[i]?.classList?.add("lastMove");
        } else {
          allDroppables[i]?.classList?.remove("lastMove");
        }
      }

      if (board().findLegalMoves(board()).length == 0) {
        setCheckmate(true);
        console.log("checkmate", checkmate());
        if (checkmate() == true) {
          alert("Checkmate");
          checkMateFunction();
        }
      }
    }
  }

  function syncFens(newFen: string) {
    let newBoard = new Board(undefined, newFen);
    board().board = newBoard.board;
    board().fen = newBoard.fen;
    board().Pieces = newBoard.Pieces;
    return;
  }

  function onNotificationReceived(notification: any) {
    setNotificationData(notification);
    //I need to either start a game or join a game
    if (notification.type == "promptForGame") {
      setNotificationData(notification);
      console.log("prompt for game");
      let button = document.querySelector("#notificationButton");
      button.click();
    } else if (notification.type == "createGame") {
      console.log("received create game notification", notification);
      setNotificationData(notification);
      //game has already been created and we are already in it,
      //what we need to do it make sure to ping the server to let it know we are alive
      setInGameColor(notification.fromUserColor);
      setInGame(true);
      removeBackDrop();
      console.log("in game", inGame());
      console.log("in game color", inGameColor());
      joinExistingGame(notification);
    } else if (notification.type == "position") {
      console.log(notification);
    }
  }


  async function createAndJoinGame(notification: any) {
    console.log("we must create a game");
    //we are the receiving(to) user, we create the game
    let createGameNotif = new CreateGameNotification(
      notification.from,
      notification.to
    );
    //need to use ChessWebSockets object
    try {
      chessWebSocket.ws.send(JSON.stringify(createGameNotif));
      setInGameColor(
        createGameNotif.fromUserColor === "white" ? "black" : "white"
      );
      setInGame(true);
      removeBackDrop();
    } catch (error) {
      console.log("error: ", error);
    }
  }

  function removeBackDrop() {
    let backDrop = document.querySelector(".modal-backdrop ");
    if (backDrop != null) {
      backDrop.remove();
    }
  }

  function joinExistingGame(notification: any) {
    console.log("create a game");
  }

  //need to highlight the squares that are the last move

  return (
    <>
      <BallsBackground />
      <div class="oponentsCursor"></div>
      <Show when={!inSession() && inGame() == false}>
        <GlassOverlay
          user={user}
          setUser={setUser}
          setInSession={setInSession}
          chessWebSocket={chessWebSocket}
        />
      </Show>
      <Show when={inSession() && inGame() == false}>
        <UsersList
          users={users}
          user={user}
          setNotificationUser={setNotificationUser}
          onNotificationReceived={onNotificationReceived}
          chessWebSocket={chessWebSocket}
        />
      </Show>

      <Show
        when={
          inGameColor() == "white" && inGame() == true
          // || true
        }
      >
        <WhiteChessboard
          board={board}
          updateBoard={updateAllBoards}
          setLastMove={setLastMove}
          lastMove={lastMove}
          movePieceSound={movePieceSound}
          capturePieceSound={capturePieceSound}
        />
      </Show>
      <Show
        when={
          inGame() == false || (inGameColor() == "black" && inGame() == true)
        }
      >
        <BlackChessboard
          board={board}
          updateBlackBoard={updateAllBoards}
          setLastMove={setLastMove}
          lastMove={lastMove}
          movePieceSound={movePieceSound}
          capturePieceSound={capturePieceSound}
        />
      </Show>

      <Show when={inGame() == false}>
        <div
          id="notificationButton"
          data-bs-toggle="modal"
          data-bs-target={"#notificationModal"}
        ></div>

        <div
          class="modal fade "
          id="notificationModal"
          style={{ display: "none" }}
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog absolute top-[39vh] left-1/ ">
            <div class="modal-content w-[50px] ">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  Play Chess with "{notificationUser()?.username}"
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                You've recieved a notification from "
                {notificationUser()?.username}" to play chess. Do you accept?
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={() => {
                    //
                    createAndJoinGame(notificationData());
                  }}
                >
                  Play Chess
                </button>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}

export default Home;

