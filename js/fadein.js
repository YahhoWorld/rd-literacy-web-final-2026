console.log("fadein loaded");

const items = document.querySelectorAll(".news-item");

function fadeIn() {
    items.forEach(item => {
        const top = item.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            item.classList.add("show");
        }
    });
}

window.addEventListener("scroll", fadeIn);
window.addEventListener("load", fadeIn);