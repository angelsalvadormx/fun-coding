//Controls
const gridMap = document.getElementById('gridMap');
const printButton = document.getElementById('printButton');
const rotateButton = document.getElementById('rotateButton');
const downButton = document.getElementById('downButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

//Map
const height = 22;
const width  = 22;
const sizeBlock = 32;
const sizeBound = 10;
const speed = 700;

var mapArray = new Array(height).fill().map(() => Array(width).fill(0));

//grafic map setup
let gridTemplate = {
    columns: `${sizeBound}px repeat(${width-2}, ${sizeBlock}px) ${sizeBound}px`,
    rows: `${sizeBound}px repeat(${height-2}, ${sizeBlock}px) ${sizeBound}px`,
    width: `${(sizeBound*2) + ((width-2) * sizeBlock)}px`,
    height: `${(sizeBound*2) + ((height-2) * sizeBlock)}px`
}

gridMap.style.setProperty('width', gridTemplate.width);
gridMap.style.setProperty('height', gridTemplate.height);
gridMap.style.setProperty('grid-template-columns', gridTemplate.columns);
gridMap.style.setProperty('grid-template-rows', gridTemplate.rows);


//draw boundaries
for (let y = 0; y < width; y++){
    mapArray[0][y] = 3; 
    mapArray[width - 1][y] = 3;
}
for (let x = 0; x < height; x++){
    mapArray[x][0] = 3;
    mapArray[x][height-1] = 3;
}

function newObject() {
    mapArray[3][2] = 1;
    mapArray[3][3] = 1;
    mapArray[3][4] = 1;
    mapArray[4][3] = 1;
}


function printMapArray () {

    while (gridMap.firstChild)
        gridMap.removeChild(gridMap.firstChild);

    mapArray.forEach((i, indexi) => {
        i.forEach((j, indexj) => {
            if (j == '1') {
                let object = document.createElement('div');
                object.classList.add('object')
                object.style.gridColumn = indexi+1;
                object.style.gridRow = indexj+1;
                gridMap.appendChild(object);
            }
            if (j == '2') {
                let object = document.createElement('div');
                object.classList.add('static')
                object.style.gridColumn = indexi+1;
                object.style.gridRow = indexj+1;
                gridMap.appendChild(object);
            }
            if (j == '3') {
                let object = document.createElement('div');
                object.classList.add('bound')
                //if (indexi == 0){
                //    object.style.width = (sizeBlock / 3).toString() + 'px';
                //}
                object.style.gridColumn = indexi+1;
                object.style.gridRow = indexj+1;
                gridMap.appendChild(object);
            }
        });
    });

}

function findObject () {
    let obj = [];
    mapArray.forEach((i, indexi) => {
        i.forEach((j, indexj) => {
            if (j == '1') {
                obj.push([indexi, indexj]);
            }
        });
    });
    return obj;
}

function updateObject (newObj) {

    //remove object
    mapArray.forEach((i, indexi) => {
        i.forEach((j, indexj) => {
            if (j == '1') {
                mapArray[indexi][indexj] = 0;
            }
        });
    });

    //add new object
    newObj.forEach((cord) => {
        mapArray[cord[0]][cord[1]] = 1;
    });

    printMapArray();

}

function rotateObject() {

    let obj = findObject();

    //transpose de object
    let xcolumns = [];
    let yrows = [];
    let transposedObj = [];

    obj.forEach((cord, index) => {
        xcolumns.push(cord[1]);
        yrows.push(cord[0]);
        transposedObj.push([cord[1], cord[0]]);
    });
    
    //get max, mins and range
    let maxx = Math.max(...xcolumns);
    let minx = Math.min(...xcolumns);
    let miny = Math.min(...yrows);
    let move = minx - miny; //distance from base position
    let rotatedObject = [];
    let range = [];
    
    for (let i = minx; i <= maxx; i++)
    range.push(i);
    
    //invert de object 
    transposedObj.forEach((cord, index) => {
        let newcord = range.findIndex(i => i == cord[0]);
        rotatedObject.push([range[range.length - newcord - 1] - move, cord[1] + move]);
    });
    
    if (!detectCollision(rotatedObject))
        updateObject(rotatedObject);
}

function detectCollision(obj) {
    console.log(obj)

    for (let cord of obj) {
        let point = mapArray[cord[0]][cord[1]];
        if (point === 2 || point === 3){
            console.log('Collision!')
            return true;
        }
    }
    return false;
}

function moveObject(dir) {

    let obj = findObject();
    let newobj = [];

    if (dir === 'down') {
        obj.forEach((cord) => {
            newobj.push([cord[0], cord[1] + 1]);
        })

    } else if (dir === 'left') {
        obj.forEach((cord) => {
            newobj.push([cord[0] - 1, cord[1]]);
        })

    } else if (dir === 'right') {
        obj.forEach((cord) => {
            newobj.push([cord[0] + 1, cord[1]]);
        })
    }

    if (!detectCollision(newobj)) {
        updateObject(newobj);
    } else {
        if (dir === 'down') {
            obj.forEach((cord) => {
                mapArray[cord[0]][cord[1]] = 2;
            })
            newObject();
        }
            
    }

}


function handleKeyboardInput(e) {

    if (e.keyCode == '40') {
        moveObject('down');
    }
    else if (e.keyCode == '37') {
        moveObject('left');
    }
    else if (e.keyCode == '39') {
        moveObject('right');
    }
    else if (e.keyCode == '88') {
        rotateObject();
    }
}


document.onkeydown = handleKeyboardInput;

window.onload = () => {

    newObject();
    function scene () {
        moveObject('down');
    }
    setInterval(scene, 700);
}