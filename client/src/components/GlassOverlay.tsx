import { createSignal, onMount, Accessor, Setter } from "solid-js";
import { User } from "../Classes/Types";
import { ChessWebSocket } from "../Classes/ChessWebSockets";
type Props = {
  user : Accessor<User | undefined>,
  setUser : Setter<User | undefined>,
  setInSession : Setter<boolean>,
  chessWebSocket : ChessWebSocket
};

const GlassOverlay = ({
  user,
  setUser,
  setInSession,
  chessWebSocket,
}: Props) => {

  let username = ""
  const [CatUrl, setCatUrl] = createSignal<string>("");


  const onButtonCLick = async () => {
    
    if(username === "") {
      alert("Please enter a username");
      return;
    }

    if(username.length > 10) {
      username = username.slice(0, 10);
    }
    if(username === user()?.username) {
      let newUser = new User(
          generateUserid(),
          username,
          CatUrl()
      )
      setUser(newUser);
      setInSession(true);
      chessWebSocket.beginPinging(user);
      return;
    }
    let newUser = new User(
      generateUserid(),
      username,
      CatUrl()
    )


    setUser(newUser);
    console.log()
    chessWebSocket.beginPinging(user);
    console.log(newUser, newUser.id)
    chessWebSocket.pingWebSocket(newUser);

    sessionStorage.setItem(
      "gabrielmalek/chess.data",
      JSON.stringify({ id: newUser.id, username: newUser.username, CatUrl: newUser.CatUrl })
    );
    localStorage.setItem(
      "gabrielmalek/chess.data",
      JSON.stringify({ id: newUser.id, username: newUser.username, CatUrl: newUser.CatUrl })
    )
    setInSession(true);
      return;
  };

  async function getRandomCatLink() {
    const response =  await fetch("https://api.thecatapi.com/v1/images/search");
    const data = await response.json();
    return data[0].url;
  }

  onMount(() => {
    //add evnet listener to the enter key
    document.addEventListener("keyup", function (event) {
      if (event.key === "Enter") onButtonCLick();
    });
    let input: any = document.getElementById("userNameInput");
    input?.focus();
    console.log(user()?.username)
    if(user()?.username !== undefined){
      input.value = user()?.username;
      username = input.value;;
    }
    getRandomCatLink().then((url) => {
      setCatUrl(url);
    });
  });

  return (
    <div class="glassOverlay">
      <label for="username">Choose your username</label>
      <div class="userNameInput">
        <input
          type="username"
          placeholder="username"
          id="userNameInput"
          onKeyUp={(e) => username = e.currentTarget.value}
        />
      </div>
      <button class="submitUsernameButton" onClick={() => onButtonCLick()}>
        LET'S GO
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 arrow"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
          />
        </svg>
      </button>
    </div>
  );
};

export default GlassOverlay;

function generateUserid() {
  //generate string of 20 digits using a for loop
  let userid = "";
  for (let i = 0; i < 20; i++) {
    userid += Math.floor(Math.random() * 10);
  }
  return userid;
};


