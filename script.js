const canvas=document.querySelector("canvas");
let toolButtons=document.querySelectorAll(".tools")
let fillColor=document.querySelector("#fill-color");
console.log(toolButtons);
ctx=canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot,
isDrawing=false,
selectedTool="brush",
brushSize=5;


window.addEventListener("load",()=>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
});

const drawRectangle = (e) => {
    if(fillColor.checked){
        ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    else ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath();
    let radius= Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked?ctx.fill() : ctx.stroke();

}


const startDraw=(e)=>{
    isDrawing=true;
    //passing current mouse pos as prev vals
    prevMouseX=e.offsetX;
    prevMouseY=e.offsetY;
    ctx.beginPath(); //creates a new path to draw if not added it starts from the point we left mouse
    ctx.lineWidth=brushSize;
    snapshot=ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return;
    ctx.putImageData(snapshot,0,0);

    if(selectedTool==="brush"){
        ctx.lineTo(e.offsetX, e.offsetY); // creates line according to mouse pointer
        ctx.stroke(); // filling line with color
    } else if(selectedTool==="rectangle"){
        drawRectangle(e);
    } else if(selectedTool==="circle"){
        drawCircle(e);
    }
    
}

toolButtons.forEach(btn => {
    btn.addEventListener("click",()=>{
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool= btn.id;
        console.log(selectedTool);
    });
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", ()=>{isDrawing=false});