import { createSignal, onMount, Show } from "solid-js";
import WhiteChessboard from "./WhiteChessboard";
import BlackChessboard from "./BlackChessboard";
import GlassOverlay from "./glassOverlay";

type Props = {};

//here I choose the color of board, but this is too soon, I need to create a pop up screen to choose a username
//that also checks for a username, in both session, and local storage. And, then requests the graphql to see if the user exisits,
//and if there are any active games, and if so, it will load the game. Otherwise, it will create the user, in the graphl, or update it.


function Home({}: Props) {

  const [userName, setUserName]: any = createSignal("");
  const [userId, setUserId]: any = createSignal("");
  let sessionStorageUser = false;


  onMount(() => {
    checkforUser();
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
      sessionStorageUser = true;
      console.log("session storage not null");
      setUserId(chessDataJson.userId);
      setUserName(chessDataJson.userName);
      return;
    }
    chessData= localStorage.getItem("gabrielmalek/chess.data");
    if(chessData == null) {
      console.log("local storage null");
     }else{
      return;
      console.log("local storage not null");
      setUserId(chessDataJson.userId);
      setUserName(chessDataJson.userName);
     }
  
  
  }
  

  return (
    <>
    <GlassOverlay 
    userName={userName}
    userId={userId}
    />
    <Show when={false}>
      <WhiteChessboard/>
    </Show>
      <BlackChessboard/>
    </>
  );
}

export default Home;
