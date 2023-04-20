import { createSignal, onMount } from "solid-js";

type Props = {
  oldUserName: any;
  oldUserId: any;
  setSessionStorageUser: any;
  addUserToGraphql: any;
  updateLastSeen: any;
  setOldUserName: any;
  setOldUserId: any;
};

const GlassOverlay = ({
  oldUserName,
  oldUserId,
  setSessionStorageUser,
  addUserToGraphql,
  updateLastSeen,
  setOldUserName,
  setOldUserId,
}: Props) => {
  const [username, setUsername] = createSignal("");
  const [userid, setUserid] = createSignal("");

  const onButtonCLick = () => {
    //here I add the username to the session and local storage
    //but first I need to generate a user ID
    let newUserID = generateUserid();
    let usernameInputed = username();
    if (usernameInputed == "") {
      alert("Please enter a username");
      return;
    }
    if (usernameInputed == oldUserName()) {
      console.log("userid: ", userid());
      console.log("username: ", usernameInputed);
      let currentID = userid();
      let currentName = usernameInputed;
      console.log("kept from local storage");
      sessionStorage.setItem(
        "gabrielmalek/chess.data",
        JSON.stringify({ userId: currentID, userName: currentName })
      );
      setSessionStorageUser(true);
      updateLastSeen();
      setInterval(updateLastSeen, 6000);
      console.log("made it here");
      addUserToGraphql();
      return;
    }
    console.log("userid: ", userid());
    console.log("username: ", usernameInputed);
    setOldUserId(newUserID);
    setOldUserName(usernameInputed);
    sessionStorage.setItem(
      "gabrielmalek/chess.data",
      JSON.stringify({ userId: newUserID, userName: usernameInputed })
    );
    localStorage.setItem(
      "gabrielmalek/chess.data",
      JSON.stringify({ userId: newUserID, userName: usernameInputed })
    );
    let inputElement = document.getElementById(
      "userNameInput"
    ) as HTMLInputElement;
    inputElement.value = "";
    setUsername("");
    setSessionStorageUser(true);
    updateLastSeen();
    setInterval(updateLastSeen, 6000);
    addUserToGraphql();
  };

  onMount(() => {
    //add evnet listener to the enter key
    document.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        onButtonCLick();
      }
    });
    console.log("username: " + username());
    console.log("oldUserName " + oldUserName());
    console.log("oldUserId " + oldUserId());
    if (oldUserName() != "") {
      setUsername(oldUserName());
      setUserid(oldUserId());
      let inputElement = document.getElementById(
        "userNameInput"
      ) as HTMLInputElement;
      inputElement.value = username();
    }
    // let inputElement = document.getElementById("userNameInput") as HTMLInputElement;
    // let userid = generateUserid();
    // let usernameInputed = username();
    // console.log("userid: ", userid);
    // console.log("username: ", usernameInputed);
    // inputElement.value = "";
    // setUsername("");
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
}

70179348562267666923;
