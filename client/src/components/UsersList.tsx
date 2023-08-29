import { For, Show, createSignal, onMount, Accessor } from "solid-js";
import CatLogo from "./CatLogo";
import { User } from "./Home";

type Props = {
  users: Accessor<User[]>;
  user: Accessor<User | undefined>
};

function UsersList({ users, user }: Props) {
  const [selectedUser, setSelectedUser] = createSignal<User>();
  const [notificationSent, setNotificationSent] = createSignal(false);

  function clickUser(user: any) {
    // console.log("selected user: ", user);
    setSelectedUser(user);
    let modal = document.getElementById("exampleModal");
    //add clas flex important
    modal?.style.setProperty("display", "flex");
  }


  return (
    <>
      <div class="glassOverlay">
        <ul class="list">
          <li class="listItem" id="mainUser">
            <div class="text">{user()?.username}</div>
            <CatLogo catLink={user()?.cat_url} />
            <button onClick={() => console.log(users())}>🠮</button>
            </li>
          <For each={users()}>
            {(singleUser) => (
              //here I list users
              <li
                class="listItem"
                id={singleUser.id}
                data-bs-toggle={"modal"}
                data-bs-target={"#exampleModal"}
                onClick={
                    () => clickUser(singleUser)
                }
              >
                <div class="text">{singleUser.username}</div>
                <CatLogo catLink={singleUser.cat_url} />
                <button onClick={() => console.log(users())}>🠮</button>
              </li>
            )}
          </For>
        </ul>
      </div>

      <div
        class="modal fade "
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog absolute top-[39vh] left-1/ ">
          <div class="modal-content w-[50px] ">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Play Chess with{" "}
                {selectedUser() != undefined
                  ? `${selectedUser()?.username}`
                  : ""}
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              Play online with this player right now!
            </div>
            <div class="modal-footer">
              <Show when={notificationSent()}>
                <div class="absolute left-3 text-red-500">
                  Notification sent!,
                </div>
              </Show>

              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={() => {
                  if(notificationSent() == false){
                    setNotificationSent(true);
                  }
                  
                  }

                  
                  }
             
              >
                Play Chess
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UsersList;
