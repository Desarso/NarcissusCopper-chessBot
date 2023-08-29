import { createSignal, onMount, Accessor, Setter } from "solid-js";
import { User } from "./Home";
type Props = {
  user : Accessor<User | undefined>,
  setUser : Setter<User | undefined>,
  setInSession : Setter<boolean>,
  pingWebSocket : (user: User) => void,
};

const GlassOverlay = ({
  user,
  setUser,
  setInSession,
  pingWebSocket,
}: Props) => {

  const [username, setUsername] = createSignal(user()?.username);

  const onButtonCLick = async () => {
    //here I add the username to the session and local storage
    //but first I need to generate a user ID
    let usernameInputed = username();
    if (usernameInputed == "") {
      alert("Please enter a username");
      return;
    }
    if(username() === user()?.username) {
      setInSession(true);
      return;
    }
    let newUser = new User(
      generateUserid(),
      username(),
      await getRandomCatLink(),
    )
    setUser(newUser);
    pingWebSocket(newUser);

    sessionStorage.setItem(
      "gabrielmalek/chess.data",
      JSON.stringify({ id: newUser.id, username: newUser.username, cat_url: newUser.cat_url })
    );
    localStorage.setItem(
      "gabrielmalek/chess.data",
      JSON.stringify({ id: newUser.id, username: newUser.username, cat_url: newUser.cat_url })
    )
    setInSession(true);
      return;
  };

  onMount(() => {
    //add evnet listener to the enter key
    document.addEventListener("keyup", function (event) {
      console.log(event.key)
      if (event.key === "Enter") {
        console.log("enter key pressed");
        onButtonCLick();
      }
    });
    let input: any = document.getElementById("userNameInput");
    input?.focus();
    console.log(user()?.username)
    if(user()?.username !== undefined){
      input.value = user()?.username;
    }
  });

  return (
    <div class="glassOverlay">
      <label for="username">Choose your username</label>
      <div class="userNameInput">
        <input
          type="username"
          placeholder="username"
          id="userNameInput"
          onKeyUp={(e) => setUsername(e.target?.value)}
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

async function getRandomCatLink() {
  //fetch https://api.thecatapi.com/v1/images/search
  const response = await fetch("https://api.thecatapi.com/v1/images/search");
  const data = await response.json();
  return data[0].url;
}
