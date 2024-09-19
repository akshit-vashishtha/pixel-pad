const canvas=document.querySelector("canvas");
let toolButtons=document.querySelectorAll(".tools")
console.log(toolButtons);
ctx=canvas.getContext("2d");

let isDrawing=false;
let brushSize=5;
window.addEventListener("load",()=>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
});

const startDraw=()=>{
    isDrawing=true;
    ctx.beginPath(); //creates a new path to draw if not added it starts from the point we left mouse
    ctx.lineWidth=brushSize;
}

const drawing = (e) => {
    if(!isDrawing) return;
    ctx.lineTo(e.offsetX, e.offsetY); // creates line according to mouse pointer
    ctx.stroke(); // filling line with color
}

toolButtons.forEach(btn => {
    btn.addEventListener("click",()=>{
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        console.log(btn.id);  // Check if btn has the correct element and ID
    });
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", ()=>{isDrawing=false});