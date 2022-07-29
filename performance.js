

main();
function main(){
    const start = performance.now();
    let number = 0;
    for(let i=0;i<1500000;i++){
        number++;
    }
    // console.log("this",number);
    const end = performance.now();


    console.log("Time take:",end-start," milliseconds.");
}