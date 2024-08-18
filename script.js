function buildGrid (numRows, numCols){
    const grid = document.createElement("div");
    grid.classList.add("grid");
    gridContainer.appendChild(grid);
    
    for (let i = 0; i < numRows; i++){
        const row = document.createElement("div");
        row.classList.add("row")
        for (let j = 0; j < numCols; j++){
            const box = document.createElement("div")
            box.classList.add("box")
            box.classList.add("box:hover")
            box.style.width = `${gridLength / numCols}px`
            box.style.height = `${gridLength / numRows}px`
            box.addEventListener(drawMode, colorMap[colorMode])
            row.appendChild(box)
        }
        grid.appendChild(row)
    }
}

function removeGrid (){
    const grid = document.querySelector(".grid")
    gridContainer.removeChild(grid)
}

function updateEventListeners (type, newColorFunction) {
    const boxes = document.querySelectorAll(".box")
    boxes.forEach((box) => {
        colorFunctions.forEach((colorFunction) => {
            box.removeEventListener("mouseover", colorFunction);
            box.removeEventListener("click", colorFunction);
        })
        box.addEventListener(type, newColorFunction)
    })
}

function updateDrawMode (){
    if (drawMode === "mouseover"){
        updateEventListeners("click", colorMap[colorMode])
        drawMode = "click"
    }
    else{
        updateEventListeners("mouseover", colorMap[colorMode])
        drawMode = "mouseover"
    }

    drawModeButton.textContent = drawMode === "mouseover" ? "Draw on click" : "Draw on hover";
}

function setButtonAsSelected (button) {
    const colorButtons = document.querySelectorAll("button.color")
    colorButtons.forEach((btn) => {
        btn.classList.remove("selected")
    })
    button.classList.add("selected")
}

function fillBlack(e){
    e.target.style.backgroundColor = "black";
}

function fillRainbow(e){
    e.target.style.backgroundColor = getRandomRGBColor();
}

function fillTransparent(e){
    e.target.style.backgroundColor = "";
}

function getRandomRGBColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}


const DEFAULT_GRID_ROWS = 16;
const DEFAULT_GRID_COLS = 16;
const MAX_GRID_SIZE = 100

const gridLength = 512;
const gridContainer = document.querySelector(".gridContainer")

const inputRow = document.querySelector(".inputRow");
const inputCol = document.querySelector(".inputCol");

const newGridButton = document.querySelector("button.newGrid");
const rainbowButton = document.querySelector("button.rainbow");
const blackButton = document.querySelector("button.black");
const resetButton = document.querySelector("button.reset");
const eraseButton = document.querySelector("button.erase");
const drawModeButton = document.querySelector("button.drawMode");

const colorFunctions = [fillBlack, fillRainbow, fillTransparent]

let colorMode = "black";
let colorMap = {"black" : fillBlack, "rainbow" : fillRainbow, "transparent" : fillTransparent}
let drawMode = "mouseover";

buildGrid(DEFAULT_GRID_ROWS, DEFAULT_GRID_COLS);

newGridButton.addEventListener ("click", () => {
    if (inputRow.value === "" || inputCol.value === ""){
        alert("Enter grid dimensions")
        return;
    }
    if ( 
        !Number.isInteger(Number(inputRow.value)) || !Number.isInteger(Number(inputCol.value))
    ) {
        alert("Enter valid numbers")
        return;
    }
    removeGrid();
    inputRow.value = Math.min(inputRow.value, MAX_GRID_SIZE)
    inputCol.value = Math.min(inputCol.value, MAX_GRID_SIZE)

    buildGrid(inputRow.value, inputCol.value);
    
})

rainbowButton.addEventListener("click", () => {
    if (colorMode != "rainbow") {
        updateEventListeners(drawMode, fillRainbow);
        colorMode = "rainbow";
    }
    setButtonAsSelected(rainbowButton)
})

blackButton.addEventListener("click", () => {
    if (colorMode != "black") {
        updateEventListeners(drawMode, fillBlack);
        colorMode = "black";
    } 
    setButtonAsSelected(blackButton)
})


eraseButton.addEventListener("click", () => {
    if (colorMode != "transparent") {
        updateEventListeners(drawMode, fillTransparent);
        colorMode = "transparent";
    }
    setButtonAsSelected(eraseButton)
    
})

resetButton.addEventListener("click", () => {
    boxes = document.querySelectorAll(".box");
    boxes.forEach((box) => {
        box.style.backgroundColor = ""
    })
})

drawModeButton.addEventListener("click", updateDrawMode)




