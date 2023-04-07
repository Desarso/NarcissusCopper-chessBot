import { createSignal, onMount } from "solid-js"


type Props = {
  userName: any;
  userId: any;
}

const GlassOverlay = ({userName, userId}: Props) => {

  const [username, setUsername] = createSignal("");
  const [userid, setUserid] = createSignal("");

  const onButtonCLick = () => {
    //here I add the username to the session and local storage
    //but first I need to generate a user ID
    let userid = generateUserid();
    let usernameInputed = username();
    if(usernameInputed == "") {
      alert("Please enter a username");
      return;
    }
    if(username() == userName()){
      console.log("userid: ", userid);
      console.log("username: ", usernameInputed);
      console.log("kept from local storage");
      let inputElement = document.getElementById("userNameInput") as HTMLInputElement;
      inputElement.value = "";
      setUsername("");
      return;
    }
    console.log("userid: ", userid);
    console.log("username: ", usernameInputed);
    sessionStorage.setItem("gabrielmalek/chess.data", JSON.stringify({userId: userid, userName: usernameInputed}));
    localStorage.setItem("gabrielmalek/chess.data", JSON.stringify({userId: userid, userName: usernameInputed}));
    let inputElement = document.getElementById("userNameInput") as HTMLInputElement;
    inputElement.value = "";
    setUsername("");
  }

  onMount(() => {
    //add evnet listener to the enter key
    document.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
        onButtonCLick();
      }

 
    })
    console.log("username: ", username());
    console.log(userName());
    if(userName() != "") {
      setUsername(userName());
      setUserid(userId());
      let inputElement = document.getElementById("userNameInput") as HTMLInputElement;
      inputElement.value = username();
    }
    // let inputElement = document.getElementById("userNameInput") as HTMLInputElement;
    // let userid = generateUserid();
    // let usernameInputed = username();
    // console.log("userid: ", userid);
    // console.log("username: ", usernameInputed);
    // inputElement.value = "";
    // setUsername("");
  })


  return (
    <div class="glassOverlay">
        <label for="username">Choose your username</label>
        <div class="userNameInput">
          <input type="username" placeholder="username" id="userNameInput"onKeyUp={e=>setUsername(e.target?.value)}/>
        </div>
        <button class="submitUsernameButton" onClick={() => onButtonCLick()}>
            LET'S GO
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 arrow">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </button>
        
    </div>
  )
}

export default GlassOverlay


function generateUserid() {
  //generate string of 20 digits using a for loop
  let userid = "";
  for(let i = 0; i < 20; i++) {
    userid += Math.floor(Math.random() * 10);
  }
  return userid;


}