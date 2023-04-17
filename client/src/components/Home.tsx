import { createSignal, onMount, Show } from "solid-js";
import WhiteChessboard from "./WhiteChessboard";
import BlackChessboard from "./BlackChessboard";
import GlassOverlay from "./glassOverlay";
import UsersList from "./UsersList";

type Props = {};

//here I choose the color of board, but this is too soon, I need to create a pop up screen to choose a username
//that also checks for a username, in both session, and local storage. And, then requests the graphql to see if the user exisits,
//and if there are any active games, and if so, it will load the game. Otherwise, it will create the user, in the graphl, or update it.


function Home({}: Props) {

  const [oldUserName, setUserName]: any = createSignal("");
  const [oldUserId, setUserId]: any = createSignal("");
  const [sessionStorageUser, setSessionStorageUser]: any = createSignal(false);
  const [inGame, setInGame]: any = createSignal(false);


  onMount(() => {
    checkforUser();
    //I also need to subscribe to users in the graphql
    subscribeToUsers();
    //mutate graphql to add the currentUser
    localStorage.setItem("gabrielmalek/online", "true");
    window.onbeforeunload = function() {
      //only if user is not in a game, and only in the lobby
      if(inGame() == false){
        //mutate graphql to remove the currentUser
      }
      localStorage.setItem("gabrielmalek/online", "false");
      
    }
  })

  function checkforUser() {
    //check for user in local storage
    //check for user in session storage
    //check for user in graphql
    let chessData =  sessionStorage.getItem("gabrielmalek/chess.data");
    let chessDataJson = JSON.parse(chessData!);
    if(chessData == null) {
     console.log("session storage null");
    }else{
      setSessionStorageUser(true);
      console.log("session storage not null");
      setUserId(chessDataJson.userId);
      setUserName(chessDataJson.userName);
      return;
    }
    chessData= localStorage.getItem("gabrielmalek/chess.data");
    chessDataJson = JSON.parse(chessData!);
    if(chessData == null) {
      console.log("local storage null");
     }else{
      console.log("local storage not null");
      // console.log(chessDataJson)
      setUserId(chessDataJson.userId);
      setUserName(chessDataJson.userName);
     }
  
  
  }

  function subscribeToUsers() {
    //subscribe to users in graphql
  }
  

  return (
    <>
    <Show when={!sessionStorageUser()}>
        <GlassOverlay 
        oldUserName={oldUserName}
        oldUserId={oldUserId}
        setSessionStorageUser={setSessionStorageUser}
        />
    </Show>
    <Show when={sessionStorageUser()}>
      <UsersList
        users={[
          "Desarso",
          "Yourmom",
        ]}
      />
    </Show>
   

    <Show when={true}>
      {/* <WhiteChessboard/> */}
    </Show>
      <BlackChessboard/>
    </>
  );
}


export default Home;
