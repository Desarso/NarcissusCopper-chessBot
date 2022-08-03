const { hello } = require('./build/Release/hello.node');



const cStart = performance.now();
hello();
const cEnd = performance.now();


const start = performance.now();
let num;
for(let i=0; i<150000;i++){
    num++
}
const end = performance.now();

console.log("C++ time:" , cEnd-cStart);
console.log("JS time:",end-start);