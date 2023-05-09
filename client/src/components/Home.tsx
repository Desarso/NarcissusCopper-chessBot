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
import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";
import { Board } from "../Classes/chessClasses";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const sendNotification = gql`
  mutation (
    $gameId: String!
    $requesterID: String!
    $requesterColor: String!
    $receiverID: String!
  ) {
    sendNotification(
      gameId: $gameId
      requesterID: $requesterID
      requesterColor: $requesterColor
      receiverID: $receiverID
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
    deleteUser(id: $id) {
      id
    }
  }
`;

const userSub = gql`
  subscription {
    users {
      id
      username
      cat_url
    }
  }
`;

const addUser = gql`
  mutation ($id: ID!, $username: String!, $cat_url: String!) {
    addUser(id: $id, username: $username, cat_url: $cat_url) {
      id
    }
  }
`;

const updateTime = gql`
  mutation ($id: ID!) {
    updateLastSeen(id: $id) {
      id
    }
  }
`;

const notificationSub = gql`
  subscription {
    notifications {
      receiverID
      requesterID
      requesterColor
      gameId
    }
  }
`;

const createGame = gql`
  mutation (
    $fen: String!
    $gameId: String!
    $receiverID: String!
    $requesterID: String!
    $requesterColor: String!
  ) {
    createGame(
      fen: $fen
      gameId: $gameId
      receiverID: $receiverID
      requesterID: $requesterID
      requesterColor: $requesterColor
    ) {
      id
      fen
      receiverID
      requesterID
      requesterColor
      started
    }
  }
`;

const gameSub = gql`
  subscription ($gameId: ID!) {
    game(id: $gameId) {
      id
      fen
      requesterColor
      receiverID
      requesterID
      started
    }
  }
`;
const startGameMutation = gql`
  mutation ($gameId: String!) {
    startGame(gameId: $gameId) {
      id
    }
  }
`;

type Props = {};

//here I choose the color of board, but this is too soon, I need to create a pop up screen to choose a username
//that also checks for a username, in both session, and local storage. And, then requests the graphql to see if the user exisits,
//and if there are any active games, and if so, it will load the game. Otherwise, it will create the user, in the graphl, or update it.

function Home({}: Props) {
  let board = new Board();
  const [oldUserName, setUserName]: any = createSignal("");
  const [oldUserId, setUserId]: any = createSignal("");
  const [sessionStorageUser, setSessionStorageUser]: any = createSignal(false);
  const [inGame, setInGame]: any = createSignal(false);
  const [inGameColor, setInGameColor]: any = createSignal("");
  const [gameId, setGameId]: any = createSignal("");
  const [users, setUsers]: any = createSignal([]);
  const [notificationUser, setNotificationUser]: any = createSignal(null);
  const [notificationData, setNotificationData]: any = createSignal(null);

  function putUserFirst(result: any) {
    //put user first in the list
    let usersCopy = result;
    let userIndex = usersCopy.findIndex((user: any) => user.id == oldUserId());
    let user = usersCopy[userIndex];
    usersCopy.splice(userIndex, 1);
    usersCopy.unshift(user);
    setUsers(usersCopy);
  }

  //I must make all users subscribe to their notifications, on mount
  //they will see a pop up upon getting a game request, and they can accept or decline
  onMount(async () => {
    //check for user in local storage and session storage
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
        // console.log("sub triggered");

        if (
          !UserInList(oldUserId(), result.data.users) ||
          !UserInList(oldUserId(), users()) ||
          users().length != result.data.users.length
        ) {
          // setUsers(result.data.users);
          putUserFirst(result.data.users);
          console.log("mutated");
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
        console.log(result.data.notifications);
        if (result.data.notifications.receiverID == oldUserId()) {
          console.log("notification received from another user");
          setNotificationData(result.data.notifications);
          for (let i = 0; i < users().length; i++) {
            //find the user that sent the notification
            if (users()[i].id == result.data.notifications.requesterID) {
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
    for (let i = 0; i < list.length; i++) {
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
    let requesterID = oldUserId();
    let requesterColor = chooseColor();
    let receiverID = user.id;

    client.mutate({
      mutation: createGame,
      variables: {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        gameId: gameId,
        receiverID: receiverID,
        requesterID: requesterID,
        requesterColor: requesterColor,
      },
    });

    client.mutate({
      mutation: sendNotification,
      variables: {
        gameId: gameId,
        receiverID: receiverID,
        requesterID: requesterID,
        requesterColor: requesterColor,
      },
    });

    let data = {
      gameId: gameId,
      receiverID: receiverID,
      requesterID: requesterID,
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



  function reverseArray(array : any){
    let reversedArray = [];
    for(let i = array.length-1; i>=0; i--){
      reversedArray.push(array[i]);
    }
    return reversedArray;
  }

  function updateBoard(){

    let UIboard =  document.querySelectorAll('.chessSquare');
    let UIArray = [];

    //I get the UI classes and create an array to make comparison easier
    //for black pieces all I need to do to make updateBoard work is to reverse the array
    //and then I can use the same code

    //I reverse the array to make sure the algorithm works for black pieces
    //UIBoard = reverseArray(UIBoard);

    for(let i = 0; i < UIboard.length; i++){
      if(UIboard[i].children[0] != undefined){
        UIArray.push(UIboard[i].children[0].classList[0]);
    }else{
      UIArray.push(" ");
    }
  }

    //I loop thur the board and check mismatches, I use a space and piecebuffer
    //since I am only checking for one piece at a time

    let pieceBuffer;
    let squareBuffer;

    for(let i =0; i<64;i++){

      //here I check if there is a piece missing on the UI
      //if so I check if pieceBuffer exists
      //if so append, else  I mark the squareBuffer
      if(UIArray[i] != board.board[i]){
        if(UIArray[i] == " " && board.board[i] != " "){
          squareBuffer = UIboard[i];
          if(pieceBuffer != undefined){
            UIboard[i].appendChild(pieceBuffer);
            pieceBuffer = undefined;
          }
        //here I check if there is a piece on the UI that is not on the board
        //if so I insert the piece into the piece buffer
        //if there is a square buffer I append the piece to the square buffer
        }else if(UIArray[i] != " " && board.board[i] == " "){
          pieceBuffer = UIboard[i].children[0];
          if(squareBuffer != undefined){
            squareBuffer.appendChild(pieceBuffer);
            pieceBuffer = undefined;
            squareBuffer = undefined;
          }
        }
      }
    }
    //if there is a piece buffer left over I remove it
    if(pieceBuffer != undefined){
      pieceBuffer?.parentElement?.removeChild(pieceBuffer);
    }



  }

  function updateBlackBoard(){

    let UIboard: any =  document.querySelectorAll('.chessSquare');
    let UIArray: any = [];

    //I get the UI classes and create an array to make comparison easier
    //for black pieces all I need to do to make updateBoard work is to reverse the array
    //and then I can use the same code

    //I reverse the array to make sure the algorithm works for black pieces
    UIboard = reverseArray(UIboard);

    for(let i = 0; i < UIboard.length; i++){
      if(UIboard[i].children[0] != undefined){
        UIArray.push(UIboard[i].children[0].classList[0]);
    }else{
      UIArray.push(" ");
    }
  }

    //I loop thur the board and check mismatches, I use a space and piecebuffer
    //since I am only checking for one piece at a time

    let pieceBuffer;
    let squareBuffer;

    for(let i =0; i<64;i++){

      //here I check if there is a piece missing on the UI
      //if so I check if pieceBuffer exists
      //if so append, else  I mark the squareBuffer
      if(UIArray[i] != board.board[i]){
        if(UIArray[i] == " " && board.board[i] != " "){
          squareBuffer = UIboard[i];
          if(pieceBuffer != undefined){
            UIboard[i].appendChild(pieceBuffer);
            pieceBuffer = undefined;
          }
        //here I check if there is a piece on the UI that is not on the board
        //if so I insert the piece into the piece buffer
        //if there is a square buffer I append the piece to the square buffer
        }else if(UIArray[i] != " " && board.board[i] == " "){
          pieceBuffer = UIboard[i].children[0];
          if(squareBuffer != undefined){
            squareBuffer.appendChild(pieceBuffer);
            pieceBuffer = undefined;
            squareBuffer = undefined;
          }
        }
      }
    }
    //if there is a piece buffer left over I remove it
    if(pieceBuffer != undefined){
      pieceBuffer?.parentElement?.removeChild(pieceBuffer);
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
          if (result.data.game.started == true) {
            setGameId(data.game.id);
            setInGame(true);
            removeSelfFromUsersList();
            if(inGameColor() == ""){
              let requesterColor = result.data.game.requesterColor;
              // console.log("requesterID", result.data.game);
              if(result.data.game.requesterID == oldUserId()){
                setInGameColor(requesterColor);
              }else{
                setInGameColor(requesterColor == "white" ? "black" : "white");
              }
              console.log("in game color", inGameColor());
            }
            let modalBackDrop = document.querySelector(".modal-backdrop");
            modalBackDrop?.remove();
            console.log("game started", result.data.game.started);
          }
          console.log("result", result.data.game.started);
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

  return (
    <>
      <Show when={!sessionStorageUser() && inGame() == false}>
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
        <UsersList users={users} userId={oldUserId} playChess={playChess} />
      </Show>

      <Show when={inGameColor() == "white" && inGame() == true}>
        <WhiteChessboard
          client={client}
          board={board}
          updateBoard={updateBoard}
          gql={gql}
          gameId={gameId}
        />
      </Show>
      <Show
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
