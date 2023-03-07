import { onMount, Show } from "solid-js";
import WhiteChessboard from "./WhiteChessboard";
import BlackChessboard from "./BlackChessboard";

type Props = {};



function Home({}: Props) {

  return (
    <>
    <Show when={false}>
      <WhiteChessboard/>
    </Show>
      <BlackChessboard/>
    </>
  );
}

export default Home;
