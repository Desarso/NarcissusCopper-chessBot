import { For } from "solid-js";
import CatLogo from "./CatLogo"


type Props = {
  users: String[];
}

function UsersList({users}: Props) {



  return (
    <div class="glassOverlay">
        <ul class="list">
          <For each={users}>
            {(user) => <li class="listItem">{user}<CatLogo/><button>🠮</button></li>}
          </For>
          {/* <li class="listItem">Desarso<CatLogo/></li>
          <li class="listItem">Yourmom<CatLogo/></li> */}
        </ul>
    </div>
  )
}

export default UsersList