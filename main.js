const WIDTH = 1400;
const HEIGHT = 1200;
const P = 20;
var temp2;
const offSetX = 15;
const offSetY = 30;
let i = 0;


/********************************* Vector 2x1 with Matrix 3x2   ******************************************/
const MatrixA = [[1, 2,3],
                [4, 5,6],
                [7, 8,9],
                [10, 11,12]
                ];
const MatrixB = [[9, 8,7,1], 
                 [6, 5,4,1],
                 [3, 2,1,1]];

const processors = createProcessors(MatrixA.length, MatrixB[0].length);


/****************************************************************************************/
const output = [];
var invertedIndex = processors.length;
var MatrixInputA = MatrixA;
var MatrixInputB = MatrixB;
let inputIndex = 0;
let cells = processors.map((_, i) => processors[0].map(c => ({
    Min1: null,
    Vout1: null,
    Min2: null,
    Vout2: null,
    c:0
})));

//initiate matrices
MatrixInputA = initMatrix(MatrixInputA);
MatrixInputB = initiatMatrixB(MatrixInputB);




function step() {
    //get inputs from matrices 
    for (let i = 0; i < cells.length; i++) {
        cells[i][0].Min1 = inputIndex < MatrixInputA[0].length ? MatrixInputA[i][inputIndex] : null;
    }
    for (let j = 0; j < cells[0].length; j++) {
        cells[0][j].Min2 = inputIndex < MatrixInputB[0].length ? MatrixInputB[j][inputIndex] : null;

    }

    inputIndex++;

    //connection cells
    for (let i = 0; i < cells.length; i++) {
        for (let j = 1; j < cells[0].length; j++) {
            cells[i][j].Min1 = cells[i][j - 1].Vout1;
        }
    }
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[0].length; j++) {
            cells[i][j].Vout1 = cells[i][j].Min1;
        }
    }
    for (let j = 0; j < cells[0].length; j++) {
        for (let i = 1; i < cells.length; i++) {
            cells[i][j].Min2 = cells[i - 1][j].Vout2;
        }
    }
    for (let j = 0; j < cells[0].length; j++) {
        for (let i = 0; i < cells.length; i++) {
            cells[i][j].Vout2 = cells[i][j].Min2;
        }
    }

    // calculate
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[0].length; j++) {
            if (cells[i][j].Min2 !== null && cells[i][j] !== null) {
                cells[i][j].c = cells[i][j].Min1 * cells[i][j].Min2 + cells[i][j].c;
            }
        }
    }
}

function draw() {

    clear();
    textAlign(LEFT, BOTTOM)
    textSize(27)
    text('Press "enter" to advance', 10, 100)
    textAlign(LEFT, TOP)
    textSize(16)

    //  checking the multiplication condition
    if (MatrixB.length == MatrixA[0].length) {
        cells.forEach((row, index1) => row.forEach((cell, index2) => {
            const left = WIDTH / 4 + 200 * (index2 + 1), top = HEIGHT / 9 + 200 * (index1);
            fill(255);
            rect(left, top, 100, 150)
            fill(0);
            textAlign(CENTER, CENTER)
            textSize(24)
            text('P' + index1 + index2, left, top, 100, 70);
            if (cell.c !== null) {
                text(cell.c, left, top + 70, 100, 70);
            }
            if (cell.Vout1 && index2 != cells[0].length - 1) {
                text(cell.Vout1, left + 66, top + 25, 100, 70);
            }
            textSize(16)
            if (index2 == 0) {
                text(MatrixInputA[index1].slice(inputIndex).reverse().join(), left - 120, top + 70)
            }
            if (index1 == 0) {
                text(MatrixInputB[index2].slice(inputIndex).reverse().join(), left + 50, top - 70)
            }
            line(left - 50, top + 70, left, top + 70)
            if (cell.Min1 !== null) {
                textAlign(RIGHT, BOTTOM);
                text(cell.Min1, left - 5, top + 65)
            }
            line(left + 50, top - 50, left + 50, top)
            if (cell.Min2 !== null) {
                textAlign(RIGHT, BOTTOM);
                text(cell.Min2, left + 45, top)
            }
            if (index2 != cells[0].length - 1) {
                line(left + 100, top + 70, left + 150, top + 70)
            }
            if (cell.Vout2 !== null && index1 != cells.length - 1) {
                textAlign(LEFT, BOTTOM);
                text(cell.Vout2, left + 25, top + 170)
            }
            if (index2 > -1 && index2 < cells[0].length - 1) {
                rect(left + 150, top + 60, 10, 20);
            }
            if (index1 > 0 && index1 < cells.length) {
                rect(left + 45, top - 35, 10, 20);
            }
        }));
    }
    else {
        clear();
        write_Error("ERROR: Columns of the Matrix S should be equal to MatrixB's rows");
    }
}



function keyTyped() {
    // 13 represents the 'enter' key
    if (keyCode == 13) {
        step();

    }
}
function initMatrix(temp) {
    let Rows = temp.length;
    let Shifting = Rows - 1;
    let newB_Cols = temp[0].length + Shifting;
    matrixtest = make_2D_Array(Rows, newB_Cols);
    for (let i = 0; i < matrixtest.length; i++) {
        for (let j = 0; j < matrixtest[i].length; j++) {
            matrixtest[i][j] = 0;
        }
    }
    for (let i = 0; i < temp.length; i++) {
        for (let j = 0; j < temp[i].length; j++) {
            matrixtest[i][j + Shifting] = temp[i][j];
        }
        Shifting -= 1;
    }
    for (let i = 0; i < matrixtest.length; i++) {
        matrixtest[i]=matrixtest[i].reverse();        
    }
    return matrixtest;
}

function setup() {
    createCanvas(WIDTH, HEIGHT);
}

function make_2D_Array(rowsA, colsB) {
    var arr = new Array(rowsA);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(colsB);
    }
    return arr;
}

function createProcessors(rows,cols) {    
let resultProcessors = make_2D_Array(rows, cols);
for (let i = 0; i < resultProcessors.length; i++) {
    for (let j = 0; j < resultProcessors[0].length; j++) {
        resultProcessors[i][j]=0;    
}    
}
return resultProcessors;
}

function write_Error(words) {
    fill(255, 2, 0);
    textSize(24)
    text(words, 450, 250);
}

function make_2D_Array(rowsA, colsB) {
    var arr = new Array(rowsA);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(colsB);
    }
    return arr;
}

function initiatMatrixB(temp) {
let resultArr=[];
    for (let i = 0; i < temp[0].length; i++) {
        resultArr[i]= getCol(temp, i);
    }
    resultArr = initMatrix(resultArr);
    return resultArr;
}

function getCol(matrix, col){
    var column = [];
    for(var i=0; i<matrix.length; i++){
       column.push(matrix[i][col]);
    }
    return column;
 }