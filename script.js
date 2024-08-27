function buildGrid (numRows, numCols){
    const grid = document.createElement("div");
    grid.classList.add("grid");
    gridContainer.appendChild(grid);
    
    for (let i = 0; i < numRows; i++){
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < numCols; j++){
            const box = document.createElement("div");
            box.classList.add("box");
            box.classList.add("box:hover");
            box.style.width = `${gridLength / numCols}px`;
            box.style.height = `${gridLength / numRows}px`;
            box.addEventListener(drawMode, fillColor);
            row.appendChild(box);
        }
        grid.appendChild(row);
    }
}

function removeGrid (){
    const grid = document.querySelector(".grid");
    gridContainer.removeChild(grid);
}

function updateEventListeners (type) {
    const boxes = document.querySelectorAll(".box");
    boxes.forEach((box) => {
        box.removeEventListener("mouseover", fillColor);
        box.removeEventListener("click", fillColor);
        box.addEventListener(type, fillColor);
    })
}

function updateDrawMode (){
    if (drawMode === "mouseover"){
        updateEventListeners("click");
        drawMode = "click";
    }
    else{
        updateEventListeners("mouseover");
        drawMode = "mouseover";
    }

    drawModeButton.textContent = drawMode === "mouseover" ? "Draw on click" : "Draw on hover";
}

function setButtonAsSelected (button) {
    const colorButtons = document.querySelectorAll("button.color");
    colorButtons.forEach((btn) => {
        btn.classList.remove("selected");
    })
    colorPicker.classList.remove("selected");
    button.classList.add("selected");
}



function getRandomRGBColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function fillColor(e){
    switch (colorMode){
        case "black" :
            e.target.style.backgroundColor = "black";
            break
        case "rainbow":
            e.target.style.backgroundColor = getRandomRGBColor();
            break
        case "transparent":
            e.target.style.backgroundColor = "";
            break

        default:
            //Custom color
            e.target.style.backgroundColor = colorMode;
            break;
    }
}


const DEFAULT_GRID_ROWS = 16;
const DEFAULT_GRID_COLS = 16;
const MAX_GRID_SIZE = 100;

const gridLength = 512;
const gridContainer = document.querySelector(".gridContainer");

const inputRow = document.querySelector(".inputRow");
const inputCol = document.querySelector(".inputCol");

const newGridButton = document.querySelector("button.newGrid");
const rainbowButton = document.querySelector("button.rainbow");
const blackButton = document.querySelector("button.black");
const resetButton = document.querySelector("button.reset");
const eraseButton = document.querySelector("button.erase");
const drawModeButton = document.querySelector("button.drawMode");
const colorPicker = document.querySelector(".colorPicker")

setButtonAsSelected(blackButton);

let colorMode = "black";
let drawMode = "mouseover";

buildGrid(DEFAULT_GRID_ROWS, DEFAULT_GRID_COLS);

newGridButton.addEventListener ("click", () => {
    if (inputRow.value === "" || inputCol.value === ""){
        alert("Enter grid dimensions");
        return;
    }
    if ( 
        !Number.isInteger(Number(inputRow.value)) || !Number.isInteger(Number(inputCol.value))
        || Number(inputRow.value) < 1 || Number(inputCol.value) < 1
    ) {
        alert("Enter valid numbers");
        return;
    }
    removeGrid();
    inputRow.value = Math.min(inputRow.value, MAX_GRID_SIZE);
    inputCol.value = Math.min(inputCol.value, MAX_GRID_SIZE);

    buildGrid(inputRow.value, inputCol.value);
    
})

rainbowButton.addEventListener("click", () => {
    colorMode = "rainbow";
    setButtonAsSelected(rainbowButton);
})

blackButton.addEventListener("click", () => {
    colorMode = "black";
    setButtonAsSelected(blackButton);
})


eraseButton.addEventListener("click", () => {
    colorMode = "transparent";
    setButtonAsSelected(eraseButton);
    
})

resetButton.addEventListener("click", () => {
    boxes = document.querySelectorAll(".box");
    boxes.forEach((box) => {
        box.style.backgroundColor = "";
    })
})

drawModeButton.addEventListener("click", updateDrawMode);

colorPicker.addEventListener("input", () => {
    colorMode = colorPicker.value;
    setButtonAsSelected(colorPicker);
})