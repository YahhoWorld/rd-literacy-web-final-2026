const paintMenu = document.querySelector(".paint-menu");
const colors = [
    "#ff3b30",
    "#007aff",
    "#34c759",
    "#ffcc00",
    "#af52de",
    "#ff9500", 
];
const inks = [
    "ink_red.png",
    "ink_blue.png",
    "ink_green.png",
    "ink_yellow.png",
    "ink_purple.png"
];
let lastTime = 0;

paintMenu.addEventListener("click", (e) => {

    const ink = document.createElement("div");
    ink.classList.add("ink");

    const image = inks[Math.floor(Math.random() * inks.length)];

    ink.style.backgroundImage =
        `url("../images/common/${image}")`;

    const rect = paintMenu.getBoundingClientRect();

    ink.style.left = `${e.clientX - rect.left}px`;
    ink.style.top = `${e.clientY - rect.top}px`;

    ink.style.transform += ` rotate(${Math.random() * 360}deg)`;

    paintMenu.appendChild(ink);

    setTimeout(() => {
        ink.remove();
    }, 700);
});

let index = 0
let colorLastTime = 0
paintMenu.addEventListener("pointermove", (e) => {

    const now = Date.now();
    if (now - lastTime < 30) return;
    
    lastTime = now;

    const trail = document.createElement("div");
    trail.classList.add("trail");


    trail.style.backgroundColor =
        colors[index];

    const rect = paintMenu.getBoundingClientRect();
    

    trail.style.left = `${e.clientX - rect.left}px`;
    trail.style.top = `${e.clientY - rect.top}px`;
    

    paintMenu.appendChild(trail);
    setTimeout(() => {
        trail.remove();
    }, 500);

    // 色変える秒数おくらす
    if (now - colorLastTime < 1000) return;
    index = Math.floor(Math.random() * colors.length)
    colorLastTime = now;
    
});