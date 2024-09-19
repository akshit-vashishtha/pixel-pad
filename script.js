const canvas=document.querySelector("canvas");
let toolButtons=document.querySelectorAll(".tools")
let fillColor=document.querySelector("#fill-color");
let size=document.querySelector("#size-slider");
let colorBtns=document.querySelectorAll(".colors .option");
let colorPicker=document.querySelector("#color-picker");
let clearCanvas=document.querySelector(".clear-canvas");
let saveImage=document.querySelector(".save-img");
console.log(toolButtons);
ctx=canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot,
isDrawing=false,
selectedTool="brush",
brushSize=5,
selectedColor="#000";

const setCanvasBackground = () => {
    //setting whole canvas bg to white so downloaded img background is also white
    ctx.fillStyle="#fff";
    ctx.fillRect(0 , 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load",()=>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setCanvasBackground();
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

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX*2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked? ctx.fill() : ctx.stroke();
}

const startDraw=(e)=>{
    isDrawing=true;
    //passing current mouse pos as prev vals
    prevMouseX=e.offsetX;
    prevMouseY=e.offsetY;
    ctx.beginPath(); //creates a new path to draw if not added it starts from the point we left mouse
    ctx.lineWidth=brushSize;
    ctx.strokeStyle=selectedColor;
    ctx.fillStyle=selectedColor;
    snapshot=ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return;
    ctx.putImageData(snapshot,0,0);

    if(selectedTool==="brush" || selectedTool==="eraser"){
        //if selected tool is eraser then strokestyle that is color of brush white which will act like eraser
        ctx.strokeStyle=selectedTool==="eraser"?"#fff":selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creates line according to mouse pointer
        ctx.stroke(); // filling line with color
    } else if(selectedTool==="rectangle"){
        drawRectangle(e);
    } else if(selectedTool==="circle"){
        drawCircle(e);
    } else if(selectedTool==="triangle"){
        drawTriangle(e);
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

colorBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    })
})

colorPicker.addEventListener("change", ()=>{
    colorPicker.parentElement.style.background=colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click",()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setCanvasBackground();
})

saveImage.addEventListener("click",()=>{
    const link=document.createElement("a");
    link.download=`${Date.now()}.jpg`;
    link.href=canvas.toDataURL();
    link.click(); //clicking link to download image
})

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", ()=>{isDrawing=false});
size.addEventListener("change",()=>{brushSize=size.value});
