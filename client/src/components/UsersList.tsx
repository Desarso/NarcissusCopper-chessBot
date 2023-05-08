import { For, Show, createSignal, onMount } from "solid-js";
import CatLogo from "./CatLogo";

type Props = {
  users: any;
  userId: any;
  playChess: any;
};

function UsersList({ users, userId, playChess }: Props) {
  const [selectedUser, setSelectedUser] = createSignal(null);
  const [notificationSent, setNotificationSent] = createSignal(false);

  function clickUser(user: any) {
    console.log("selected user: ", user);
    setSelectedUser(user);
    let modal = document.getElementById("exampleModal");
    //add clas flex important
    modal?.style.setProperty("display", "flex");
  }

  return (
    <>
      <div class="glassOverlay">
        <ul class="list">
          <For each={users()}>
            {(user) => (
              //here I list users
              <li
                class="listItem"
                id={`${user.id == userId() ? "mainUser" : ""}`}
                data-bs-toggle={`${user.id == userId() ? "" : "modal"}`}
                data-bs-target={`${user.id == userId() ? "" : "#exampleModal"}`}
                onClick={
                  user.id == userId()
                    ? () => console.log("clicked main user -- do nothing")
                    : () => clickUser(user)
                }
              >
                <div class="text">{user.username}</div>
                <CatLogo catLink={user.cat_url} />
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
                    playChess(selectedUser())
                    setTimeout(() => {
                      setNotificationSent(false);
                    }, 5000);
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
