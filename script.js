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
            box.style.width = `${gridLength / numCols}px`
            box.style.height = `${gridLength / numRows}px`
            box.addEventListener("mouseover", fillBlack)
            row.appendChild(box)
        }
        grid.appendChild(row)
    }
}

function removeGrid (){
    const grid = document.querySelector(".grid")
    gridContainer.removeChild(grid)
}

function updateColorListeners (newColorFunction) {
    const boxes = document.querySelectorAll(".box")
    boxes.forEach((box) => {
        colorFunctions.forEach((colorFunction) => {
            box.removeEventListener("mouseover", colorFunction);

        })
        box.addEventListener("mouseover", newColorFunction)
    })
}

function fillBlack(e){
    e.target.style.backgroundColor = "black";
}

function fillRainbow(e){
    e.target.style.backgroundColor = getRandomRGBColor();
}

function fillWhite(e){
    e.target.style.backgroundColor = "white";
}

const colorFunctions = [fillBlack, fillRainbow, fillWhite]

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

buildGrid(DEFAULT_GRID_ROWS, DEFAULT_GRID_COLS);

const newGridButton = document.querySelector("button.newGrid");
const rainbowButton = document.querySelector("button.rainbow");
const blackButton = document.querySelector("button.black");
const resetButton = document.querySelector("button.reset");
const eraseButton = document.querySelector("button.erase");


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

let colorMode = "black";

rainbowButton.addEventListener("click", () => {
    if (colorMode != "rainbow") {
        updateColorListeners(fillRainbow);
        colorMode = "rainbow";
    }
})

blackButton.addEventListener("click", () => {
    if (colorMode != "black") {
        updateColorListeners(fillBlack);
        colorMode = "black";
    } 
})

resetButton.addEventListener("click", () => {
    boxes = document.querySelectorAll(".box");
    boxes.forEach((box) => {
        box.style.backgroundColor = "white"
    })
})

eraseButton.addEventListener("click", () => {
    if (colorMode != "white") {
        updateColorListeners(fillWhite);
        colorMode = "white";
    }
})


