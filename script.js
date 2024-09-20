const canvas = document.querySelector("canvas");
let toolButtons = document.querySelectorAll(".tools");
let fillColor = document.querySelector("#fill-color");
let size = document.querySelector("#size-slider");
let colorBtns = document.querySelectorAll(".colors .option");
let colorPicker = document.querySelector("#color-picker");
let clearCanvas = document.querySelector(".clear-canvas");
let saveImage = document.querySelector(".save-img");
let ctx = canvas.getContext("2d");

let prevPos, snapshot,
isDrawing = false,
selectedTool = "brush",
brushSize = 5,
selectedColor = "#000";

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRectangle = (e) => {
    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    if (fillColor.checked) {
        ctx.fillRect(prevPos.x, prevPos.y, offsetX - prevPos.x, offsetY - prevPos.y);
    } else {
        ctx.strokeRect(prevPos.x, prevPos.y, offsetX - prevPos.x, offsetY - prevPos.y);
    }
}

const drawCircle = (e) => {
    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevPos.x - offsetX), 2) + Math.pow((prevPos.y - offsetY), 2));
    ctx.arc(prevPos.x, prevPos.y, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = (e) => {
    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(prevPos.x, prevPos.y);
    ctx.lineTo(offsetX, offsetY);
    ctx.lineTo(prevPos.x * 2 - offsetX, offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const startDraw = (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    prevPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    ctx.beginPath();
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    } else if (selectedTool === "rectangle") {
        drawRectangle(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else if (selectedTool === "triangle") {
        drawTriangle(e);
    }
}

toolButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveImage.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

const handleStart = (e) => {
    e.preventDefault();
    if (e.touches) e = e.touches[0];
    startDraw(e);
};

const handleMove = (e) => {
    e.preventDefault();
    if (e.touches) e = e.touches[0];
    drawing(e);
};

const handleEnd = () => {
    isDrawing = false;
};

canvas.addEventListener("mousedown", handleStart);
canvas.addEventListener("mousemove", handleMove);
canvas.addEventListener("mouseup", handleEnd);

canvas.addEventListener("touchstart", handleStart);
canvas.addEventListener("touchmove", handleMove);
canvas.addEventListener("touchend", handleEnd);

size.addEventListener("change", () => { brushSize = size.value });

// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, { passive: false });
document.body.addEventListener("touchend", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, { passive: false });
document.body.addEventListener("touchmove", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, { passive: false });