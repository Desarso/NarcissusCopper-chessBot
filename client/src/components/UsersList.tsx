import { For } from "solid-js";
import CatLogo from "./CatLogo"


type Props = {
  users: any;
}

function UsersList({users}: Props) {



  //I need the user list to be fetched from home and passed here



  return (
    <div class="glassOverlay">
        <ul class="list">
          <For each={users()}>
            {(user) => 
            <li class="listItem">
              <div class="text">{user.username}</div>
              <CatLogo
                catLink={user.cat_url}
              />
              <button 
                onClick={()=> console.log(users())}>
                  🠮
              </button>
            </li>}
          </For>
        </ul>
    </div>
  )
}

export default UsersList