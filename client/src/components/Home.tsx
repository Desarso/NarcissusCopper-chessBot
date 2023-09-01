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

type Props = {};

export class User {
  id: string;
  username: string;
  cat_url: string;
  last_seen: EpochTimeStamp = Date.now();
  inGame: boolean = false;
  constructor(id: string, username: string, cat_url: string) {
    this.id = id;
    this.username = username;
    this.cat_url = cat_url;
  }
}

class createGameNotification {
  from: User;
  fromUserColor: string;
  to: User;
  gameID: string;
  type: string = "createGame";
  constructor(from: User, to: User) {
    this.from = from;
    this.to = to;
    this.fromUserColor = Math.random() > 0.5 ? "white" : "black";
    this.gameID = generateRandomId();
  }
}

class Position {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class PositionNotification {
  from: User;
  to: User;
  position: Position;
  screen: Position;
  type: string = "position";
  chessBoardWidth: number;
  constructor(
    from: User,
    to: User,
    position: Position,
    chessBoardWidth: number
  ) {
    this.from = from;
    this.to = to;
    this.position = position;
    this.screen = new Position(window.innerWidth, window.innerHeight);
    this.chessBoardWidth = chessBoardWidth;
  }
}

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

  const [ws, setWs] = createSignal<WebSocket>();

  const createWS = (url: string) => {
    const socket = new WebSocket(url);
    return socket;
  };

  function pingWebSocket(user: User) {
    ws().send(JSON.stringify(user));
  }

  onCleanup(() => {
    if (ws()) {
      ws().close();
    }
  });

  onMount(async () => {
    checkforUser();
    connectUsersWebSocket();
    document.ws = ws;
    document.setInGame = setInGame;
    document.addEventListener("mousedown", onMouseDown);
    updatePosition();
    // movePieceSound.play();
    // capturePieceSound.play();
  });

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
      ws().send(JSON.stringify(positionNotification));
    });
  }

  function onMouseDown(mouseEvent) {
    // Check if the event is a double click
    if (mouseEvent.detail > 1) {
      mouseEvent.preventDefault(); // Prevent text selection for double clicks
    }
  }

  function normalizeCoordinates(
    otherUserX,
    otherUserY,
    yourScreenWidth,
    yourScreenHeight,
    otherUserScreenWidth,
    otherUserScreenHeight
  ) {
    const scaleX = yourScreenWidth / otherUserScreenWidth;
    const scaleY = yourScreenHeight / otherUserScreenHeight;

    const normalizedX = otherUserX * scaleX;
    const normalizedY = otherUserY * scaleX;

    return { x: normalizedX, y: normalizedY };
  }

  function connectUsersWebSocket() {
    const socket = createWS("ws://localhost:8080/chessUsers");
    let oponentsCursor = document.querySelector(".oponentsCursor");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let x;
    let y;
    let destinationChessboardWidth;
    let scaleFactor;
    let scaleFactorX;
    let scaleFactorY; 
    let sourceChessBoardCenterX;
    let sourceChessBoardCenterY;
    let destinationChessBoardCenterX;
    let destinationChessBoardCenterY;
    let destinationChessboardHeight;
    let xOffSet;
    let yOffSet;
    let scaledXOffset;
    let scaledYOffset;
    let alignedCursorX;
    let alignedCursorY;
    let invertedCursorX;
    let invertedCursorY;
    socket.addEventListener("open", function (event) {
      console.log("connected");
      setWs(socket);
      //and now we set ping interval
      pingWebSocket(user());
      setInterval(() => pingWebSocket(user()), 3000);
    });

    socket.addEventListener("message", function (e) {
      // console.log("message", JSON.parse(e.data));
      let data = JSON.parse(e.data);
      if (data.type == "position") {
        x = data.position.x;
        y = data.position.y;

        // scaleFactor = localChessBoardWidth / data.chessBoardWidth;

        // //THIS CHANGE

        //THIS CHANGE
        sourceChessBoardCenterX = data.screen.x/2;
        sourceChessBoardCenterY = data.screen.y/2;

        xOffSet = x - sourceChessBoardCenterX;
        yOffSet = y - sourceChessBoardCenterY;

        //THIS CHANGE
        destinationChessBoardCenterX = windowWidth / 2;
        destinationChessBoardCenterY = windowHeight / 2;

        destinationChessboardWidth = document.querySelector(".chessBoard").offsetWidth;
        destinationChessboardHeight = destinationChessboardWidth;

        scaleFactorX  = destinationChessboardWidth / data.chessBoardWidth;
        scaleFactorY  = destinationChessboardHeight / data.chessBoardWidth;

        //THIS CHANGE
        scaledXOffset = xOffSet * scaleFactorX;
        scaledYOffset = yOffSet * scaleFactorY;


        destinationChessBoardCenterX = window.innerWidth / 2;
        destinationChessBoardCenterY = window.innerHeight / 2;

        alignedCursorX = destinationChessBoardCenterX + scaledXOffset;
        alignedCursorY = destinationChessBoardCenterY + scaledYOffset;

        invertedCursorX = destinationChessBoardCenterX - scaledXOffset;
        invertedCursorY = destinationChessBoardCenterY - scaledYOffset;

        console.log("xOffSet", xOffSet, "yOffSet", yOffSet);
      

        oponentsCursor.style.transform = `translate(${invertedCursorX}px, ${invertedCursorY}px)`;
        return;
      }
      //remove current user from data.users
      let newUsers = data.users;
      let index = newUsers.findIndex(
        (singleUser: User) => singleUser.id == user().id
      );
      let currentUser = newUsers.splice(index, 1);
      let newTimeStamp = currentUser[0].last_seen;
      let newUser = user();
      newUser.last_seen = newTimeStamp;
      if (newUser.username == "") {
        return;
      }
      setUser(newUser);
      if (JSON.stringify(newUsers) == JSON.stringify(users())) {
        return;
      }
      setUsers(newUsers);
    });

    socket.addEventListener("close", function (e) {
      console.log("closed", e);
      setWs(undefined);
      if (inSession() && !inGame()) {
        setTimeout(connectUsersWebSocket, 3000);
      }
    });
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
      let user = new User(
        chessDataJson.id,
        chessDataJson.username,
        chessDataJson.cat_url
      );
      setUser(user);
      setInSession(true);
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
        chessDataJson.cat_url
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

  //okay so the pop is coming up

  async function createAndJoinGame(notification: any) {
    console.log("we must create a game");
    //we are the receiving(to) user, we create the game
    let createGameNotif = new createGameNotification(
      notification.from,
      notification.to
    );
    try {
      const url = "http://localhost:8080/chessNotifications";
      const response = await axios.post(url, createGameNotif);
      console.log("response: ", response.status);
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
      <div class="oponentsCursor"></div>
      <Show when={!inSession() && inGame() == false}>
        <GlassOverlay
          user={user}
          setUser={setUser}
          setInSession={setInSession}
          pingWebSocket={pingWebSocket}
        />
      </Show>
      <Show when={inSession() && inGame() == false}>
        <UsersList
          users={users}
          user={user}
          setNotificationUser={setNotificationUser}
          onNotificationReceived={onNotificationReceived}
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

function generateRandomId() {
  let randomId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  // console.log("random id", randomId);
  return randomId;
}
