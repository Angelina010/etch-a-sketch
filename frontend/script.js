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
            box.classList.add("box-border")
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
const colorPicker = document.querySelector(".colorPicker");
const gridLinesCheckbox = document.querySelector("#grid-lines");

const aiPrompt = document.querySelector(".aiPrompt");
const generateAIButton = document.querySelector("button.generateAI");
const aiStatus = document.querySelector(".aiStatus");

function setAIStatus(msg) {
  aiStatus.textContent = msg;
}


function applyPixelsToGrid(pixels, rows, cols) {
  // Ensure the grid is the right size
  const currentBoxes = document.querySelectorAll(".box");
  const expectedCount = rows * cols;

  if (currentBoxes.length !== expectedCount) {
    // rebuild grid to match AI output
    removeGrid();
    buildGrid(rows, cols);
  }

  const boxes = document.querySelectorAll(".box");
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const color = pixels[r][c]; // string like "#RRGGBB" or null
      boxes[idx].style.backgroundColor = color ? color : "";
    }
  }
}


async function generatePixelArtFromPrompt() {
  const prompt = aiPrompt.value.trim();
  if (!prompt) {
    setAIStatus("Type a prompt first.");
    return;
  }

  // Use the user's current grid size as a target
  const targetRows = Math.min(Number(inputRow.value || DEFAULT_GRID_ROWS), MAX_GRID_SIZE);
  const targetCols = Math.min(Number(inputCol.value || DEFAULT_GRID_COLS), MAX_GRID_SIZE);

  setAIStatus("Generating...");
  generateAIButton.disabled = true;

  try {
    const API_BASE = "https://etch-a-sketch-ten-kohl.vercel.app";


    const res = await fetch(`${API_BASE}/api/pixel-art`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, rows: targetRows, cols: targetCols })
    });


    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }

    const data = await res.json();
    // expected: { rows, cols, pixels }
    applyPixelsToGrid(data.pixels, data.rows, data.cols);
    setAIStatus("Done.");
  } catch (err) {
    console.error(err);
    setAIStatus("Error generating. Check console / server logs.");
  } finally {
    generateAIButton.disabled = false;
  }
}

generateAIButton.addEventListener("click", generatePixelArtFromPrompt);



setButtonAsSelected(blackButton);

let colorMode = "black";
let drawMode = "click";

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

gridLinesCheckbox.addEventListener("change", () => {
    boxes = document.querySelectorAll(".box");
    boxes.forEach((box) => {
        box.classList.toggle("box-border")
    })
})