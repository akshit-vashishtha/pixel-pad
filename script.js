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


let saveDrawBtn = document.querySelector(".save");
// let loadDrawSelect = document.querySelector(".load");
let deleteDrawBtn = document.querySelector(".delete");
const loadBtn = document.getElementById('loadBtn');
const loadModal = document.getElementById('loadModal');
const drawingList = document.getElementById('drawingList');
const closeModal = document.getElementById('closeModal');

const saveDrawing = () => {
    const drawingName = prompt("Enter a name for your drawing:");
    if (drawingName) {
        const drawingData = canvas.toDataURL();
        localStorage.setItem(`drawing_${drawingName}`, drawingData);
        updateLoadDrawSelect();
    }
};

// Function to open the modal and display saved drawings
const openModal = () => {
    drawingList.innerHTML = ''; // Clear previous content

    // Loop through localStorage and find all saved drawings
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('drawing_')) {
            const drawingData = localStorage.getItem(key);

            // Create a container for the drawing and delete button
            const drawingItem = document.createElement('div');
            drawingItem.classList.add('drawing-item');

            // Create an image element for the drawing
            const img = document.createElement('img');
            img.src = drawingData;
            img.alt = key;
            img.title = key;

            // Add click event to load the drawing when clicked
            img.addEventListener('click', () => {
                loadDrawing(drawingData);
                loadModal.style.display = 'none'; // Close modal after selection
            });

            // Create a delete button for the drawing
            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'Delete';
            deleteBtn.classList.add('delete-btn');

            // Add click event to delete the drawing
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the image click
                deleteDrawing(key); // Call function to delete drawing
            });

            // Append the image and delete button to the drawing item container
            drawingItem.appendChild(img);
            drawingItem.appendChild(deleteBtn);

            // Append the drawing item to the drawingList div
            drawingList.appendChild(drawingItem);
        }
    }

    loadModal.style.display = 'block'; // Show the modal
};

// Function to load a drawing onto the canvas
const loadDrawing = (drawingData) => {
    const img = new Image();
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.drawImage(img, 0, 0); // Draw the image on the canvas
    };
    img.src = drawingData; // Set the image source to the data URL
};

// Function to delete a drawing from localStorage
const deleteDrawing = (key) => {
    if (confirm('Are you sure you want to delete this drawing?')) {
        localStorage.removeItem(key); // Remove the drawing from localStorage
        openModal(); // Refresh the modal to reflect the deleted drawing
    }
};

// Event listener for the Load button
loadBtn.addEventListener('click', openModal);

// Event listener to close the modal
closeModal.addEventListener('click', () => {
    loadModal.style.display = 'none';
});

const updateLoadDrawSelect = () => {
    loadDrawSelect.innerHTML = '<option value="">Load Drawing</option>';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('drawing_')) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key.replace('drawing_', '');
            loadDrawSelect.appendChild(option);
        }
    }
};


saveDrawBtn.addEventListener("click", saveDrawing);
loadDrawSelect.addEventListener("change", loadDrawing);
deleteDrawBtn.addEventListener("click", deleteDrawing);

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
    updateLoadDrawSelect();
});