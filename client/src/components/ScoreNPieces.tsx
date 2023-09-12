import { Accessor, For, createSignal, onMount } from "solid-js";
import { Board } from "../Classes/chessClasses";


type Props = {
    color: string;
    board: Accessor<Board>;
}



function ScoreNPieces({color, board}: Props) {
    const [eatenPieces, setEatenPieces] = createSignal([]);
    const [score, setScore] = createSignal(0);


    onMount(() => {
        console.log(board())
        document.addEventListener("boardUpdated", () => {
            setEatenPieces([])
            setScore(0)
            let piecesEaten = board().capturedPieces
            for(let i = 0; i < piecesEaten.length; i++){
                if(piecesEaten[i].color != color){
                    setEatenPieces([...eatenPieces(), piecesEaten[i]])
                }
                switch (piecesEaten[i].type) {
                    case "p":
                        if(piecesEaten[i].color == color){
                            setScore(score() + -1)
                        }else{
                            setScore(score() + 1)
                        }
                        break;
                    case "n":
                        if(piecesEaten[i].color == color){
                            setScore(score() + -3)
                        }else{
                            setScore(score() + 3)
                        }
                        break;
                    case "b":
                        if(piecesEaten[i].color == color){
                            setScore(score() + -3)
                        }else{
                            setScore(score() + 3)
                        }
                        break;
                    case "r":
                        if(piecesEaten[i].color == color){
                            setScore(score() + -5)
                        }else{
                            setScore(score() + 5)
                        }
                        break;
                    case "q":
                        if(piecesEaten[i].color == color){
                            setScore(score() + -9)
                        }else{
                            setScore(score() + 9)
                        }
                    
                }
            }
        })  
    })


  return (
    <div
        class="ScoreNPieces"
    >
       <div class="score">{score() != 0 ? score() : ""}</div>
        <For each= {eatenPieces()}>
            {piece =>(

                <section class={`eatenPiece ${color == "white" ? piece.type : piece.type.toUpperCase() }`} >
      {/* noDrag */}
                <div class=""> </div>
            </section>

                
            )
            }

        </For>
    </div>
  )
}

export default ScoreNPieces