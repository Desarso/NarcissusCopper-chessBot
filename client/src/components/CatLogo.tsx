import { createResource, createSignal, onMount } from "solid-js"


type Props = {
  catLink: String;
}

function CatLogo({catLink}: Props) {

    async function getRandomCatLink(){
        //fetch https://api.thecatapi.com/v1/images/search
        const response = await fetch('https://api.thecatapi.com/v1/images/search')
        const data = await response.json()
        return data[0].url
    }

  

    // const [catLink, {refetch}] = createResource(async () =>{
    //     return getRandomCatLink()
    // });




    // onMount(async() => {
    //   const catLink = await getRandomCatLink()
    //   console.log(catLink)
    //   await setCatLink(catLink)
    // });



  return (
    <div 
    class="catLogo"
    style={`background-image: url(${catLink})`}
    >
    </div>
  )
  
}

export default CatLogo