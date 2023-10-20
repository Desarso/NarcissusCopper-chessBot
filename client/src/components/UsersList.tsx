import { For, Show, createSignal, onMount, Accessor, Setter } from "solid-js";
import CatLogo from "./CatLogo";
import { User, Notification } from "../Classes/Types";
import axios from "axios";
import BellIcon from "./BellIcon";
import { domainToUnicode } from "url";
import { ChessWebSocket } from "../Classes/ChessWebSockets";;

type Props = {
  users: Accessor<User[]>;
  user: Accessor<User | undefined>;
  setNotificationUser: Setter<User | undefined>;
  onNotificationReceived: (arg1: Notification) => void;
  chessWebSocket: ChessWebSocket;
};


function UsersList({
  users,
  user,
  setNotificationUser,
  onNotificationReceived,
  chessWebSocket,
}: Props) {
  const [selectedUser, setSelectedUser] = createSignal<User>();
  const [notificationSent, setNotificationSent] = createSignal(false);
  const [notificationsReceived, setNotificationsReceived] = createSignal<
    Notification[]
  >([]);
  const [notificationsSent, setNotificationsSent] = createSignal<
    Notification[]
  >([]);
  const [showNotification, setShowNotification] = createSignal(false);

  onMount(() => {

    document.addEventListener("notification", (event) => {
      console.log("notification event received");
      const notification = JSON.parse(event.data);
      onNotificationReceived(notification);
      //I only want to handle notifications of type promptForGame in here
      if (notification.type != "promptForGame")return;
      setNotificationUser(notification.from);
    
      console.log("notification received:", notification);

      for (let i = 0; i < notificationsReceived().length; i++) {
        if (notificationsReceived()[i].from.id == notification.from.id) {
          return;
        }
      }
      let newNotificationsReceived = notificationsReceived();
      newNotificationsReceived.push(notification);
      setNotificationsReceived(newNotificationsReceived);
      setShowNotification(true);
      
    });

  });
  

  function clickUser(user: any) {
    // console.log("selected user: ", user);
    setSelectedUser(user);
    let modal = document.getElementById("exampleModal");
    //add clas flex important
    modal?.style.setProperty("display", "flex");
  }

  async function sendNotification(notification: any) {
    for (let i = 0; i < notificationsSent().length; i++) {
      if (notificationsSent()[i].to.id == notification.to.id) {
        return;
      }
    }
    let newNotificationsSent = notificationsSent();
    newNotificationsSent.push(notification);
    setNotificationsSent(newNotificationsSent);
    chessWebSocket.sendNotification(notification);
  }

  return (
    <>
      <Show when={showNotification()}>
        <BellIcon notifications={notificationsReceived} onClick={() => {}} />
      </Show>

      <div class="glassOverlay">
        <ul class="list">
          <li class="listItem" id="mainUser">
            <div class="text">{user().username}</div>
            <CatLogo catLink={user().CatUrl} />
            {/* <button onClick={() => console.log(users())}>🠮</button> */}
          </li>
          <For each={users()}>
            {(singleUser) => (
              //here I list users
              <li
                class="listItem"
                id={singleUser.id}
                data-bs-toggle={"modal"}
                data-bs-target={"#exampleModal"}
                onClick={() => clickUser(singleUser)}
              >
                <div class="text">{singleUser.username}</div>
                <CatLogo catLink={singleUser.CatUrl} />
                {/* <button onClick={() => console.log(users())}>🠮</button> */}
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
                  Notification sent!
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
                  let newNotification = new Notification(
                    user(),
                    selectedUser(),
                    "promptForGame"
                  );
                  sendNotification(newNotification);
                  if (notificationSent() == false) {
                    setNotificationSent(true);
                  }
                }}
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
