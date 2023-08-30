import { For, Show, createSignal, onMount, Accessor, Setter } from "solid-js";
import CatLogo from "./CatLogo";
import { User } from "./Home";
import axios from "axios";
import BellIcon from "./BellIcon";
import { domainToUnicode } from "url";

type Props = {
  users: Accessor<User[]>;
  user: Accessor<User | undefined>;
  setNotificationUser: Setter<User | undefined>;
  onNotificationReceived: () => void;
};

export class Notification {
  from: User;
  to: User;
  type: string;
  constructor(from: User, to: User, type: string) {
    this.from = from;
    this.to = to;
    this.type = type;
  }
}

function UsersList({ users, user, setNotificationUser, onNotificationReceived }: Props) {
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
    document.notifications = notificationsReceived;
    const url = "http://localhost:8080/chessNotificationsSub";
    const urlWithQuery = `${url}?userID=${user()?.id}`;
    const eventSource = new EventSource(urlWithQuery);

    eventSource.onopen = (event) => {
      console.log("Connection opened");
    };

    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotificationUser(notification.from);
      onNotificationReceived();
      console.log("notification received");

      for (let i = 0; i < notificationsReceived().length; i++) {
        if (notificationsReceived()[i].from.id == notification.from.id) {
          return;
        }
      }
      let newNotificationsReceived = notificationsReceived();
      newNotificationsReceived.push(notification);
      setNotificationsReceived(newNotificationsReceived);
      setShowNotification(true);

      // Handle the SSE event data here
    };

    eventSource.onerror = (error) => {
      console.error("Error occurred:", error);
    };
  });

  function clickUser(user: any) {
    // console.log("selected user: ", user);
    setSelectedUser(user);
    let modal = document.getElementById("exampleModal");
    //add clas flex important
    modal?.style.setProperty("display", "flex");
  }

  async function sendNotification(notification: Notification) {
    for (let i = 0; i < notificationsSent().length; i++) {
      if (notificationsSent()[i].to.id == notification.to.id) {
        return;
      }
    }
    let newNotificationsSent = notificationsSent();
    newNotificationsSent.push(notification);
    setNotificationsSent(newNotificationsSent);

    try {
      const url = "http://localhost:8080/chessNotifications";
      const response = await axios.post(url, notification);
      console.log("response: ", response.status);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  return (
    <>
      <Show when={showNotification()}>
        <BellIcon notifications={notificationsReceived} onClick={() => {}} />
      </Show>

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
                onClick={() => clickUser(singleUser)}
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
