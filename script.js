const gridLength = 512;
const body = document.querySelector("body");

function buildGrid (numRows, numCols){
    const gridContainer = document.createElement("div");
    gridContainer.classList.add("container");
    body.appendChild(gridContainer);
    
    for (let i = 0; i < numRows; i++){
        const row = document.createElement("div");
        row.classList.add("row")
        for (let j = 0; j < numCols; j++){
            const box = document.createElement("div")
            box.classList.add("box")
            box.style.width = `${gridLength / numCols}px`
            box.style.height = `${gridLength / numRows}px`
            box.addEventListener("mouseover", () => {
                box.style.backgroundColor = "black";
            })
            row.appendChild(box)
        }
        gridContainer.appendChild(row)
    }
}

function removeGrid (){
    const gridContainer = document.querySelector(".container")
    body.removeChild(gridContainer)
}

buildGrid(16,16);

const inputRow = document.querySelector(".inputRow");
const inputCol = document.querySelector(".inputCol");

const newGridButton = document.querySelector("button.newGrid");
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
    if (inputRow.value > 100) {
        inputRow.value = 100;
    }

    if (inputCol.value > 100) {
        inputCol.value = 100;
    }

    buildGrid(inputRow.value, inputCol.value);
    
})