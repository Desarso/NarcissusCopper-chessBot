import {
  createReaction,
  createResource,
  createSignal,
  onMount,
  Show,
} from "solid-js";
import WhiteChessboard from "./WhiteChessboard";
import BlackChessboard from "./BlackChessboard";
import GlassOverlay from "./GlassOverlay";
import UsersList from "./UsersList";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  HttpLink,
  split,
} from "@apollo/client/core";
import { getMainDefinition } from "@apollo/client/utilities";
import { Board, Piece } from "../Classes/chessClasses";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const client = new ApolloClient({
  // uri: "https://gabrielmalek.com/graphql",
  // uri: "http://localhost:8080/query",
  uri: "http://localhost:4000/graphql",
  // link: splitLink,
  cache: new InMemoryCache(),
});

const sendNotification = gql`
  mutation (
    $gameId: String!
    $requesterId: String!
    $requesterColor: String!
    $receiverId: String!
  ) {
    sendChessRequest(
      gameId: $gameId
      requesterId: $requesterId
      requesterColor: $requesterColor
      receiverId: $receiverId
    ) {
      id
    }
  }
`;

const getUsers = gql`
  query {
    getUsers {
      id
      username
      cat_url
    }
  }
`;

const deleteUser = gql`
  mutation ($id: ID!) {
    deleteChessUser(id: $id) {
      id
    }
  }
`;

const userSub = gql`
  subscription {
    chessUsersSub {
      id
      username
      cat_url
    }
  }
`;

const addUser = gql`
  mutation ($id: ID!, $username: String!, $cat_url: String!) {
    addChessUser(id: $id, username: $username, cat_url: $cat_url) {
      id
    }
  }
`;

const updateTime = gql`
  mutation ($id: ID!) {
    updateLastSeenChess(id: $id) {
      id
    }
  }
`;

const notificationSub = gql`
  subscription {
    chessRequestsSub {
      receiverId
      requesterId
      requesterColor
      gameId
    }
  }
`;

const createGame = gql`
  mutation (
    $fen: String!
    $gameId: String!
    $receiverId: String!
    $requesterId: String!
    $requesterColor: String!
  ) {
    addChessGame(
      fen: $fen
      gameId: $gameId
      receiverId: $receiverId
      requesterId: $requesterId
      requesterColor: $requesterColor
    ) {
      id
      fen
      receiverId
      requesterId
      requesterColor
      started
    }
  }
`;

const gameSub = gql`
  subscription ($gameId: ID!) {
    chessGamesSub(id: $gameId) {
      id
      fen
      requesterColor
      receiverId
      requesterId
      started
      moves {
        from
        to
        endFen
      }
    }
  }
`;
const startGameMutation = gql`
  mutation ($gameId: String!) {
    startChessGame(gameId: $gameId) {
      id
    }
  }
`;

type Props = {};

//here I choose the color of board, but this is too soon, I need to create a pop up screen to choose a username
//that also checks for a username, in both session, and local storage. And, then requests the graphql to see if the user exisits,
//and if there are any active games, and if so, it will load the game. Otherwise, it will create the user, in the graphl, or update it.

function Home({}: Props) {
  const [board, setBoard]: any = createSignal(new Board());
  const [oldUserName, setUserName]: any = createSignal("");
  const [oldUserId, setUserId]: any = createSignal("");
  const [sessionStorageUser, setSessionStorageUser]: any = createSignal(false);
  const [inGame, setInGame]: any = createSignal(false);
  const [inGameColor, setInGameColor]: any = createSignal("");
  const [gameId, setGameId]: any = createSignal("");
  const [users, setUsers]: any = createSignal([]);
  const [notificationUser, setNotificationUser]: any = createSignal(null);
  const [notificationData, setNotificationData]: any = createSignal(null);
  const [allPieces, setAllPieces]: any = createSignal([]);
  const [lastMove, setLastMove]: any = createSignal();

  function putUserFirst(result: any) {
    //put user first in the list
    if (result == undefined) return;
    let usersCopy = result;
    // console.log("result", result)
    let userIndex = usersCopy.findIndex((user: any) => user.id == oldUserId());
    let user = usersCopy[userIndex];
    if (userIndex != 0 && usersCopy.length > 1) {
      console.log("user index", usersCopy);
      usersCopy.splice(userIndex, 1);
      usersCopy.unshift(user);
      setUsers(usersCopy);
      return;
    }
    setUsers(usersCopy);
  }

  //I must make all users subscribe to their notifications, on mount
  //they will see a pop up upon getting a game request, and they can accept or decline
  onMount(async () => {
    //check for user in local storage and session storage
    let pieces = document.querySelectorAll(".piece");
    setAllPieces(pieces);
    await checkforUser();
    await client
      .query({
        query: getUsers,
      })
      .then((result: any) => {
        console.log("users from query", result.data.getUsers);
        //we need to sort to make sure to put user in index 0;
        // setUsers(result.data.getUsers);
        putUserFirst(result.data.getUsers);
        return result.data.getUsers;
      });

    //get all pieces into array
  });

  //subscribe to users in graphql
  client
    .subscribe({
      query: userSub,
    })
    .subscribe({
      next: (result: any) => {
        //  console.log("users from sub", result.data.users);
        //  console.log(users())
        console.log("sub triggered");

        if (
          !UserInList(oldUserId(), result.data.chessUsersSub) ||
          !UserInList(oldUserId(), users()) ||
          users().length != result.data.chessUsersSub.length
        ) {
          // setUsers(result.data.users);
          if (
            result.data.chessUsersSub?.length == 0 ||
            !result.data.chessUsersSub?.length == undefined
          ) {
            return;
          }
          putUserFirst(result.data.chessUsersSub);
          // console.log("mutated");
          // console.log("users from sub", result.data.chessUsersSub);
        }
        //  console.log(result.data.users)
        //  console.log(users().length, result.data.users.length)

        return result.data.users;
      },
    });

  //subscribe to notifications in graphql
  client
    .subscribe({
      query: notificationSub,
    })
    .subscribe({
      next: (result: any) => {
        console.log(result.data.chessRequestsSub);
        if (result.data.chessRequestsSub.receiverId == oldUserId()) {
          console.log("notification received from another user");
          setNotificationData(result.data.chessRequestsSub);
          for (let i = 0; i < users().length; i++) {
            //find the user that sent the notification
            if (users()[i].id == result.data.chessRequestsSub.requesterId) {
              setNotificationUser(users()[i]);
            }
          }
          let notificationButton =
            document.getElementById("notificationButton");
          notificationButton!.click();
          //here I need to create popup to be able to accept or decline the game
        }
      },
    });

  async function refetchUsers() {
    client
      .query({
        query: getUsers,
      })
      .then((result: any) => {
        console.log("users from query", result.data.getUsers);
        //we need to sort to make sure to put user in index 0;
        // setUsers(result.data.getUsers);
        putUserFirst(result.data.getUsers);
        return result.data.getUsers;
      });
  }

  function updateLastSeen() {
    //update the last seen time in graphql\
    if (inGame() == true) {
      return;
    }
    client
      .mutate({
        mutation: updateTime,
        variables: {
          id: oldUserId(),
        },
      })
      .then((result: any) => {
        // console.log("updated last seen");
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
      console.log(chessDataJson);
      await setUserId(chessDataJson.userId);
      await setUserName(chessDataJson.userName);
      await setSessionStorageUser(true);
      updateLastSeen();
      setInterval(updateLastSeen, 6000);
      await addUserToGraphql();
      return;
    }
    chessData = localStorage.getItem("gabrielmalek/chess.data");
    chessDataJson = JSON.parse(chessData!);
    if (chessData == null) {
      console.log("local storage null");
    } else {
      console.log("local storage not null");
      // console.log(chessDataJson)
      setUserId(chessDataJson.userId);
      setUserName(chessDataJson.userName);
    }
  }

  function UserInList(id: string, list: any) {
    for (let i = 0; i < list?.length; i++) {
      if (list[i].id == id) {
        return true;
      }
    }
    return false;
  }

  async function getRandomCatLink() {
    //fetch https://api.thecatapi.com/v1/images/search
    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    const data = await response.json();
    return data[0].url;
  }

  async function addUserToGraphql() {
    //add user to graphql onyl if the user is not in the graphql already
    console.log("id", oldUserId());
    console.log("username", oldUserName());
    console.log("adding user to graphql");
    console.log("users", users());
    let cat_url = await getRandomCatLink();
    console.log("cat_url", cat_url);

    if (users() == undefined) {
      client
        .mutate({
          mutation: addUser,
          variables: {
            id: oldUserId(),
            username: oldUserName(),
            cat_url: cat_url,
          },
        })
        .then((result): any => {
          console.log("added user to graphql");
          console.log(result);
          console.log("users from here", users());
        });
      return;
    }
    if (UserInList(oldUserId(), users()) == false) {
      console.log("user not in list");
      await client
        .mutate({
          mutation: addUser,
          variables: {
            id: oldUserId(),
            username: oldUserName(),
            cat_url: cat_url,
          },
        })
        .then((result): any => {
          console.log("added user to graphql");
          console.log(result);
          console.log("users from here", users());
        });
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

  function playChess(user: any) {
    console.log("sending notification to", user.username);
    //when this function runs I need to create a notification for the user
    //so I send a mutation using the id to the graphql
    //I also want to create a game in the graphql, with a pending status.
    //one it starts I can change it's status.
    let gameId = generateRandomId();
    let requesterId = oldUserId();
    let requesterColor = chooseColor();
    let receiverId = user.id;

    client.mutate({
      mutation: createGame,
      variables: {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        gameId: gameId,
        receiverId: receiverId,
        requesterId: requesterId,
        requesterColor: requesterColor,
      },
    });

    client.mutate({
      mutation: sendNotification,
      variables: {
        gameId: gameId,
        receiverId: receiverId,
        requesterId: requesterId,
        requesterColor: requesterColor,
      },
    });

    let data = {
      gameId: gameId,
      receiverId: receiverId,
      requesterId: requesterId,
      requesterColor: requesterColor,
    };

    //I subsribe to the game from requester side
    //I need to set the board correctly
    subscribeToGame(data);

    //I also need to subscribe to the game
  }

  function removeSelfFromUsersList() {
    let usersList = users();
    let newUsersList = usersList.filter((user: any) => user.id != oldUserId());
    setUsers(newUsersList);
  }

  function reverseArray(array: any) {
    let reversedArray = [];
    for (let i = array.length - 1; i >= 0; i--) {
      reversedArray.push(array[i]);
    }
    return reversedArray;
  }

  function updateBoard() {
    //rip all pieces from board
    // //put em back
    let UIBoard = document.querySelectorAll(".chessSquare");

    let allUIPieces = document.querySelectorAll(".piece");
    for (let i = 0; i < allUIPieces.length; i++) {
      allUIPieces[i].remove();
    }
    let indexUsed: any = []
    for (let i = 0; i < board().board.length; i++) {
      if (board().board[i] != " ") {
        for (let j = 0; j < allUIPieces.length; j++) {
          if (allUIPieces[j].classList.contains(board().board[i]) && !indexUsed.includes(j)) {
            UIBoard[i].appendChild(allUIPieces[j]);
            // console.log("found piece", allUIPieces[j]);
            indexUsed.push(j);
            break;
          }
        }
      }
    }
  }

  // function reCheckPieces(UIBoard: any) {
  //   // //need to get everr piece and override the styles
  //   // //and add piece + type
  //   // let pieces = [];
  //   // for(let i = 0; i < UIBoard.length; i++){
  //   //   let pieces2 = UIBoard[i]?.querySelectorAll(".piece");
  //   //   for(let j = 0; j < pieces2.length; j++){
  //   //     pieces.push(pieces2[j]);
  //   //   }
  //   // }
  //   // for (let i = 0; i < 64; i++) {
  //   //   // let piece = UIBoard[i]?.children[0]?.classList.contains("piece")
  //   //   //   ? UIBoard[i]?.children[0]
  //   //   //   : undefined;
  //   //   //   if(UIBoard[i]?.children.length > 1){
  //   //   //     for(let j = 0; j < UIBoard[i].children.length; j++){
  //   //   //       if(UIBoard[i].children[j].classList.contains("piece")){
  //   //   //         piece = UIBoard[i].children[j];
  //   //   //       }
  //   //   //     }
  //   //   //   }
  //   //   let piece = pieces[i];
  //   //   if (piece != undefined) {
  //   //     // console.log(piece?.classList, board().board[i]);
  //   //     // console.log(piece.classList.length)
  //   //     let classLength = piece.classList.length;
  //   //     for (let i = 0; i < classLength; i++) {
  //   //       piece.classList.remove(piece.classList[i]);
  //   //     }
  //   //     console.log(piece.classList.length ,"class length")
  //   //     if (
  //   //       inGameColor() == "white" &&
  //   //       board().board[i].toLowerCase() == board().board[i]
  //   //     ) {
  //   //       piece.classList.add("notDraggable");
  //   //     }
  //   //     if (
  //   //       inGameColor() == "black" &&
  //   //       board().board[i].toUpperCase() == board().board[i]
  //   //     ) {
  //   //       piece.classList.add("notDraggable");
  //   //     }
  //   //     piece.classList.add("piece");
  //   //     piece.classList.add(board().board[i]);
  //   //   }
  //   // }
  // }

  function updateBlackBoard() {
    let UIboard: any = document.querySelectorAll(".chessSquare");
    let UIArray: any = [];

    //I get the UI classes and create an array to make comparison easier
    //for black pieces all I need to do to make updateBoard work is to reverse the array
    //and then I can use the same code

    //I reverse the array to make sure the algorithm works for black pieces
    UIboard = reverseArray(UIboard);

    for (let i = 0; i < UIboard.length; i++) {
      if (UIboard[i].children[0] != undefined) {
        UIArray.push(UIboard[i].children[0].classList[0]);
      } else {
        UIArray.push(" ");
      }
    }

    //I loop thur the board and check mismatches, I use a space and piecebuffer
    //since I am only checking for one piece at a time

    let pieceBuffer;
    let squareBuffer;

    for (let i = 0; i < 64; i++) {
      //here I check if there is a piece missing on the UI
      //if so I check if pieceBuffer exists
      //if so append, else  I mark the squareBuffer
      if (UIArray[i] != board().board[i]) {
        if (UIArray[i] == " " && board().board[i] != " ") {
          squareBuffer = UIboard[i];
          if (pieceBuffer != undefined) {
            UIboard[i].appendChild(pieceBuffer);
            pieceBuffer = undefined;
          }
          //here I check if there is a piece on the UI that is not on the board
          //if so I insert the piece into the piece buffer
          //if there is a square buffer I append the piece to the square buffer
        } else if (UIArray[i] != " " && board().board[i] == " ") {
          pieceBuffer = UIboard[i].children[0];
          if (squareBuffer != undefined) {
            squareBuffer.appendChild(pieceBuffer);
            pieceBuffer = undefined;
            squareBuffer = undefined;
          }
        }
      }
    }
    //if there is a piece buffer left over I remove it
    if (pieceBuffer != undefined) {
      pieceBuffer?.parentElement?.removeChild(pieceBuffer);
    }

    reCheckPieces(UIboard);
  }

  async function updateAllBoards(result: any) {
    console.log(result);
    let move =
      result.data.chessGamesSub.moves[
        result.data.chessGamesSub.moves.length - 1
      ];
    console.log("new move", move);
    let newFen = result.data.chessGamesSub.fen;
    if (newFen != board().fen) {
      await board().displayBoard();
      board().movePiece(move.from, move.to);
      console.log("color", inGameColor());
      if (inGameColor() == "white") {
        updateBoard();
      } else {
        updateBlackBoard();
      }
    }
    setLastMove({
      from: move.from,
      to: move.to,
    });
    let allDroppables = document.querySelectorAll(".chessSquare");
    for (let i = 0; i < allDroppables.length; i++) {
      if (
        allDroppables[i].id === lastMove().from ||
        allDroppables[i].id === lastMove().to
      ) {
        allDroppables[i]?.classList?.add("lastMove");
      } else {
        allDroppables[i]?.classList?.remove("lastMove");
      }
    }
  }

  function subscribeToGame(data: any) {
    console.log(data);
    client
      .subscribe({
        query: gameSub,
        variables: {
          gameId: data.gameId,
        },
      })
      .subscribe({
        next: (result) => {
          console.log("game sub", result.data);
          if (inGame() == true) {
            updateAllBoards(result);
          }
          if (result.data.chessGamesSub.started == true && inGame() == false) {
            setGameId(result.data.chessGamesSub.id);
            setInGame(true);
            removeSelfFromUsersList();
            if (inGameColor() == "") {
              let requesterColor = result.data.chessGamesSub.requesterColor;
              // console.log("requesterId", result.data.game);
              if (result.data.chessGamesSub.requesterId == oldUserId()) {
                setInGameColor(requesterColor);
              } else {
                setInGameColor(requesterColor == "white" ? "black" : "white");
              }
              console.log("in game color", inGameColor());
            }
            let modalBackDrop = document.querySelector(".modal-backdrop");
            modalBackDrop?.remove();
          }
        },
      });

    console.log("game created and subscribed to");
  }

  function startGame() {
    client
      .mutate({
        mutation: startGameMutation,
        variables: {
          gameId: notificationData().gameId,
        },
      })
      .then((result) => {
        console.log("game started", result);
        setInGame(true);
      });
  }

  //need to highlight the squares that are the last move

  return (
    <>
      {/* <Show when={!sessionStorageUser() && inGame() == false}>
        <GlassOverlay
          oldUserName={oldUserName}
          oldUserId={oldUserId}
          setOldUserName={setUserName}
          setOldUserId={setUserId}
          setSessionStorageUser={setSessionStorageUser}
          addUserToGraphql={addUserToGraphql}
          updateLastSeen={updateLastSeen}
        />
      </Show>
      <Show when={sessionStorageUser() && inGame() == false}>
        <UsersList
          users={users}
          userId={oldUserId}
          playChess={playChess}
          refetchUsers={refetchUsers}
        />
      </Show>

      <Show
        when={
          inGameColor() == "white" && inGame() == true
          // || true
        }
      > */}
      <WhiteChessboard
        client={client}
        board={board}
        updateBoard={updateBoard}
        gql={gql}
        gameId={gameId}
        setLastMove={setLastMove}
        lastMove={lastMove}
      />
      {/* </Show> */}
      {/* <Show
        when={
          inGame() == false || (inGameColor() == "black" && inGame() == true)
        }
      >
        <BlackChessboard
          client={client}
          board={board}
          updateBlackBoard={updateBlackBoard}
          gql={gql}
          gameId={gameId}
          setLastMove={setLastMove}
          lastMove={lastMove}
        />
      </Show> */}

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
                    subscribeToGame(notificationData());
                    //set game to started
                    startGame();
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
