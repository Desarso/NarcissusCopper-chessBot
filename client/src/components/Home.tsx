import {
  createReaction,
  createResource,
  createSignal,
  onMount,
  Show,
} from "solid-js";
import WhiteChessboard from "./WhiteChessboard";
import BlackChessboard from "./BlackChessboard";
import GlassOverlay from "./GlassOverlay";
import UsersList from "./UsersList";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const getUsers = gql`
  query {
    getUsers {
      id
      username
    }
  }
`;

const deleteUser = gql`
  mutation ($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const userSub = gql`
  subscription {
    users {
      id
      username
    }
  }
`;

const addUser = gql`
  mutation ($id: ID!, $username: String!) {
    addUser(id: $id, username: $username) {
      id
    }
  }
`;

type Props = {};

//here I choose the color of board, but this is too soon, I need to create a pop up screen to choose a username
//that also checks for a username, in both session, and local storage. And, then requests the graphql to see if the user exisits,
//and if there are any active games, and if so, it will load the game. Otherwise, it will create the user, in the graphl, or update it.

function Home({}: Props) {
  const [oldUserName, setUserName]: any = createSignal("");
  const [oldUserId, setUserId]: any = createSignal("");
  const [sessionStorageUser, setSessionStorageUser]: any = createSignal(false);
  const [inGame, setInGame]: any = createSignal(false);
  const [users, setUsers ]: any = createSignal([]);

  setUsers(client.query({
      query: getUsers,
    }).then((result: any) => {
      return result.data.getUsers;
    }));

  client
  .subscribe({
    query: userSub,
  })
  .subscribe({
    next: (result: any) => {
      console.log("sub triggered")
      console.log("users", result.data.users);
      setUsers(result.data.users);
      return result.data.users;
    },
  })

  onMount(async () => {
    await checkforUser();
    //I also need to subscribe to users in the graphql
    subscribeToUsers();
    //mutate graphql to add the currentUser
    localStorage.setItem("gabrielmalek/online", "true");
    window.onbeforeunload = function () {
      //only if user is not in a game, and only in the lobby
      if (inGame() == false) {
        //mutate graphql to remove the currentUser
      }
      removeUserFromGraphql();
      localStorage.setItem("gabrielmalek/online", "false");
    };
    window.onclose = function () {
      //only if user is not in a game, and only in the lobby
      if (inGame() == false) {
        //mutate graphql to remove the currentUser
      }
      removeUserFromGraphql();
      localStorage.setItem("gabrielmalek/online", "false");
    };

    window.onunload = function () {
      //only if user is not in a game, and only in the lobby
      if (inGame() == false) {
        //mutate graphql to remove the currentUser
      }
      removeUserFromGraphql();
      localStorage.setItem("gabrielmalek/online", "false");
    };
  });

  async function checkforUser() {
    //check for user in local storage
    //check for user in session storage
    //check for user in graphql
    let chessData = sessionStorage.getItem("gabrielmalek/chess.data");
    let chessDataJson = JSON.parse(chessData!);
    if (chessData == null) {
      console.log("session storage null");
    } else {
      console.log("session storage not null");
      console.log(chessDataJson);
      await setUserId(chessDataJson.userId);
      await setUserName(chessDataJson.userName);
      await setSessionStorageUser(true);
      await addUserToGraphql();
      return;
    }
    chessData = localStorage.getItem("gabrielmalek/chess.data");
    chessDataJson = JSON.parse(chessData!);
    if (chessData == null) {
      console.log("local storage null");
    } else {
      console.log("local storage not null");
      // console.log(chessDataJson)
      setUserId(chessDataJson.userId);
      setUserName(chessDataJson.userName);
    }
  }

  async function addUserToGraphql() {
    //add user to graphql, need to check if user already exists, by first fetching a user by ID from graphql
    console.log("id", oldUserId());
    console.log("username", oldUserName());
    console.log("adding user to graphql");
    await client
      .mutate({
        mutation: addUser,
        variables: {
          id: oldUserId(),
          username: oldUserName(),
        },
      })
      .then((result): any => {
        console.log("added user to graphql");
        console.log(result);
        console.log("users from here",users())
      });
  }

  function removeUserFromGraphql() {
    //remove user from graphql
    console.log("removing user from graphql");
    client
      .mutate({
        mutation: deleteUser,
        variables: {
          id: oldUserId(),
        },
      })
      .then((result) => {
        console.log("removed user from graphql");
        console.log(result);
      });
  }

  function subscribeToUsers() {
    //subscribe to users in graphql
  }

  return (
    <>
      <Show when={!sessionStorageUser()}>
        <GlassOverlay
          oldUserName={oldUserName}
          oldUserId={oldUserId}
          setSessionStorageUser={setSessionStorageUser}
          addUserToGraphql={addUserToGraphql}
        />
      </Show>
      <Show when={sessionStorageUser()}>
        <UsersList users={users} />
      </Show>

      <Show when={true}>{/* <WhiteChessboard/> */}</Show>
      <BlackChessboard />
    </>
  );
}

export default Home;
