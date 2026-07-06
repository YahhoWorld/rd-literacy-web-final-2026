// import { createCanvas } from "./main";

const winput=document.getElementById("width-size-input");
const hinput=document.getElementById("height-size-input");


document.getElementById("create-canvas").addEventListener("click",()=>createCanvas(winput.value,hinput.value));