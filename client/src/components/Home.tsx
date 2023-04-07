import { onMount, Show } from "solid-js";
import WhiteChessboard from "./WhiteChessboard";
import BlackChessboard from "./BlackChessboard";
import GlassOverlay from "./glassOverlay";

type Props = {};

//here I choose the color of board, but this is too soon, I need to create a pop up screen to choose a username
//that also checks for a username, in both session, and local storage. And, then requests the graphql to see if the user exisits,
//and if there are any active games, and if so, it will load the game. Otherwise, it will create the user, in the graphl, or update it.

function checkforUser() {
  //check for user in local storage
  //check for user in session storage
  //check for user in graphql
  let chessData =  sessionStorage.getItem("gabrielmalek/chess.data");
  if(chessData == null) {
   console.log("session storage null");
  }
  chessData= localStorage.getItem("gabrielmalek/chess.data");
  if(chessData == null) {
    console.log("local storage null");
   }

   //if this is the case, we need to show the user, the glass popup, that prompts for a username
   //we want to keep the default, white board, background, but disable, all touch,
   // we also, then we will have an obsolute poition glass morphic square in front on it,
   //it should ask for a username, and then it will display the lobby


}

function Home({}: Props) {

  onMount(() => {
    checkforUser();
  })

  return (
    <>
    <GlassOverlay/>
    <Show when={false}>
      <WhiteChessboard/>
    </Show>
      <BlackChessboard/>
    </>
  );
}

export default Home;
