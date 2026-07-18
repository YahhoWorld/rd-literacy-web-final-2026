// import { createCanvas } from "./main";

const winput=document.getElementById("width-size-input");
const hinput=document.getElementById("height-size-input");


document.getElementById("create-canvas-t").addEventListener ("click",()=>createCanvas(winput.value,hinput.value,"t"));
document.getElementById("create-canvas-w").addEventListener ("click",()=>createCanvas(winput.value,hinput.value,"w"));
document.getElementById("create-canvas-b").addEventListener ("click",()=>createCanvas(winput.value,hinput.value,"b"));
document.getElementById("create-canvas-gb").addEventListener("click",()=>createCanvas(winput.value,hinput.value,"gb"));