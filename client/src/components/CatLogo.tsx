import { createSignal, onMount } from "solid-js"


type Props = {}

function CatLogo({}: Props) {

    async function getRandomCatLink(){
        //fetch https://api.thecatapi.com/v1/images/search
        const response = await fetch('https://api.thecatapi.com/v1/images/search')
        const data = await response.json()
        return data[0].url
    }

  

    const [catLink, setCatLink] = createSignal("");

    onMount(async () => {
      const catLink = await getRandomCatLink()
      console.log(catLink)
      setCatLink(catLink)
  });



  return (
    <div 
    class="catLogo"
    style={`background-image: url(${catLink()})`}
    >
        {/* <img src={catLink()} alt="cat logo" /> */}
    </div>
  )
  
}

export default CatLogo