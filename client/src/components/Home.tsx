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
      cat_url
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
      cat_url
    }
  }
`;

const addUser = gql`
  mutation ($id: ID!, $username: String!, $cat_url: String!) {
    addUser(id: $id, username: $username, cat_url: $cat_url) {
      id
    }
  }
`;

const updateTime = gql`
  mutation ($id: ID!) {
    updateLastSeen(id: $id) {
      id
    }
  }`

type Props = {};

//here I choose the color of board, but this is too soon, I need to create a pop up screen to choose a username
//that also checks for a username, in both session, and local storage. And, then requests the graphql to see if the user exisits,
//and if there are any active games, and if so, it will load the game. Otherwise, it will create the user, in the graphl, or update it.

function Home({}: Props) {
  const [oldUserName, setUserName]: any = createSignal("");
  const [oldUserId, setUserId]: any = createSignal("");
  const [sessionStorageUser, setSessionStorageUser]: any = createSignal(false);
  const [inGame, setInGame]: any = createSignal(false);
  const [users, setUsers]: any = createSignal([]);




  onMount(async () => {
    //check for user in local storage and session storage
    await checkforUser();
    await client
      .query({ 
        query: getUsers
       })
       .then((result: any) => {
        console.log("users from query", result.data.getUsers);
        setUsers(result.data.getUsers);
      return result.data.getUsers;
    });
 

  });

   //subscribe to users in graphql
   client
   .subscribe({
     query: userSub,
   })
   .subscribe({
     next: (result: any) => {
      //  console.log("users from sub", result.data.users);
      //  console.log(users())
      // console.log("sub triggered");

       if(!UserInList(oldUserId(), result.data.users)
        || (!UserInList(oldUserId(), users()) 
        ||(users().length != result.data.users.length))
       ){

          setUsers(result.data.users);
          console.log("mutated")
       };
      //  console.log(result.data.users)
      //  console.log(users().length, result.data.users.length)
       
       return result.data.users;
     },
   })


  function updateLastSeen() {
    //update the last seen time in graphql
    client
    .mutate({
      mutation: updateTime,
      variables: {
        id: oldUserId(),
      },
    })
    .then((result: any) => {
      // console.log("updated last seen");
    });



  }

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
      updateLastSeen();
      setInterval(updateLastSeen, 6000);
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


  function UserInList(id: string, list: any) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        return true;
      }
    }
    return false;
  }

  async function getRandomCatLink(){
    //fetch https://api.thecatapi.com/v1/images/search
    const response = await fetch('https://api.thecatapi.com/v1/images/search')
    const data = await response.json()
    return data[0].url
}

  async function addUserToGraphql() {

    //add user to graphql onyl if the user is not in the graphql already
    console.log("id", oldUserId());
    console.log("username", oldUserName());
    console.log("adding user to graphql");
    console.log("users",users())
    let cat_url = await getRandomCatLink();
    console.log("cat_url", cat_url)

    if(users() == undefined){
      client
      .mutate({
        mutation: addUser,
        variables: {
          id: oldUserId(),
          username: oldUserName(),
          cat_url: cat_url
        },
      })
      .then((result): any => {
        console.log("added user to graphql");
        console.log(result);
        console.log("users from here",users())

      });
      return;
    }
    if(UserInList(oldUserId(), users()) == false){
      console.log("user not in list");
      await client
      .mutate({
        mutation: addUser,
        variables: {
          id: oldUserId(),
          username: oldUserName(),
          cat_url: cat_url
        },
      })
      .then((result): any => {
        console.log("added user to graphql");
        console.log(result);
        console.log("users from here",users());

      });
    }


    

     
  }

  function playChess(user: any){
    console.log("sending notification to", user.username);
    //when this function runs I need to create a notification for the user
    //so I send a mutation using the id to the graphql
  }



  return (
    <>
      <Show when={!sessionStorageUser()}>
        <GlassOverlay
          oldUserName={oldUserName}
          oldUserId={oldUserId}
          setOldUserName={setUserName}
          setOldUserId={setUserId}
          setSessionStorageUser={setSessionStorageUser}
          addUserToGraphql={addUserToGraphql}
          updateLastSeen={updateLastSeen}
        />
      </Show>
      <Show when={sessionStorageUser()}>
        <UsersList 
          users={users} 
          userId={oldUserId}
          playChess={playChess}
          />
      </Show>

      <Show when={true}>{/* <WhiteChessboard/> */}</Show>
      <BlackChessboard />
    </>
  );
}

export default Home;
