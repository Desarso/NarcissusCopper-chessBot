import {
  createReaction,
  createResource,
  createSignal,
  onMount,
  Show,
  createEffect,
  onCleanup,
} from "solid-js";
import WhiteChessboard from "./WhiteChessboard";
import BlackChessboard from "./BlackChessboard";
import GlassOverlay from "./GlassOverlay";
import UsersList from "./UsersList";
import { Board, Move } from "../Classes/chessClasses";
import { createWS, createWSState } from "@solid-primitives/websocket";
import { createEventSignal } from "@solid-primitives/event-listener";
type Props = {};

export class User {
  id: string;
  username: string;
  cat_url: string;
  last_seen: EpochTimeStamp = Date.now();
  constructor(id: string, username: string, cat_url: string) {
    this.id = id;
    this.username = username;
    this.cat_url = cat_url;
  }
}

//here I choose the color of board, but this is too soon, I need to create a pop up screen to choose a username
//that also checks for a username, in both session, and local storage. And, then requests the graphql to see if the user exisits,
//and if there are any active games, and if so, it will load the game. Otherwise, it will create the user, in the graphl, or update it.

function Home({}: Props) {
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
  const [notificationUser, setNotificationUser]: any = createSignal(null);
  const [notificationData, setNotificationData]: any = createSignal(null);
  const [ws, setWs] = createSignal<WebSocket>();

  const createWS = (url: string) => {
    const socket = new WebSocket(url);
    return socket;
  };

  function pingWebSocket(user : User) {
    if (inSession() && !inGame()) {
      ws().send(JSON.stringify(user));
    }else if(inSession() && inGame() && ws()?.close()){
      ws().close();
    }
  };

  onCleanup(() => {
    if (ws()) {
      ws().close();
    }
  });

  // const ws : WebSocket = createWS("ws://localhost:8080/chessGame")

  // // ws.send("hello world");
  // // const messageEvent = createEventSignal(ws, "message");

  onMount(async () => {
    checkforUser();
    connectUsersWebSocket();
    document.ws = ws;
    document.setInGame = setInGame;
  });

  function connectUsersWebSocket() {
    const socket = createWS("ws://localhost:8080/chessUsers");

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
      //remove current user from data.users
      let users = data.users;
      let index = users.findIndex((singleUser: User) => singleUser.id == user().id);
      let currentUser = users.splice(index, 1);
      let newTimeStamp = currentUser[0].last_seen;
      let newUser = user();
      newUser.last_seen = newTimeStamp;
      if(newUser.username == ""){
        return
      }
      setUser(newUser);
      setUsers(users);
    });

    socket.addEventListener("close", function (e) {
      console.log("closed", e);
      setWs(undefined);
      if(inSession() && !inGame()){
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
      if(newUser.username == "" || newUser.username == undefined){
        return
      }
      setUser(newUser);
      setInSession(false);
    }
  }

  function generateRandomId() {
    let randomId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    console.log("random id", randomId);
    return randomId;
  }

  function chooseColor() {
    let color = Math.random() > 0.5 ? "white" : "black";
    console.log("color", color);
    return color;
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
      updateBoard();
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

  //need to highlight the squares that are the last move

  return (
    <>
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
                    console.log("need to do something");
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
