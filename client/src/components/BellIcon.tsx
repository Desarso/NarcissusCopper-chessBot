import { Accessor, For } from "solid-js";
import { Notification } from "./UsersList";
import { text } from "stream/consumers";

type Props = {
  onClick: () => void;
  notifications: Accessor<Notification[]>;
};

function BellIcon({ onClick, notifications}: Props) {
  onClick = () => {
    console.log("bell clicked");
    console.log(notifications())
    let dropdown = document.querySelector(".dropdown-menu");
    console.log(dropdown)
    dropdown.style.display == "block" ? dropdown.style.display = "none" : dropdown.style.display = "block";
    dropdown.innerHTML = "";



    for(let i = 0; i < notifications().length; i++){
      let newElement = document.createElement("div");
      let textElement = document.createElement("div");
      let usernamediv = document.createElement("div");
      usernamediv.classList.add("username");
      usernamediv.innerText = notifications()[i].from.username;
      newElement.classList.add("dropdown-item");
      newElement.id = notifications()[i].from.id;
      textElement.classList.add("text");
      textElement.classList.add("notificationText");
      textElement.appendChild(usernamediv);

      textElement.innerHTML = "🔔&nbsp"+textElement.innerHTML +"&nbsp wants to play ";
      
      newElement.appendChild(textElement);
      dropdown.appendChild(newElement);
      console.log(newElement, "hi")
    }
    



  }



  return (
    <div class="bellContainer">
      <div class="dropdown">
        <button
          class="bellIcon"
          onClick={onClick}
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          id="dropdownMenuButton"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-16 h-16"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
            />
          </svg>
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        </div>
      </div>
    </div>
  );
}

export default BellIcon;
