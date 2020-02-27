let cols; //rows
let sclfactor = 15;
let scl;
let center;
let arrBlocks = new Array(100);;
let arrBuffer = new Array(100);;

function resizeGrid(resizePercent) {
    scl = sclfactor / (resizePercent / 100);
    let originalArrlength = arrBlocks.length;
    center = sclfactor * (resizePercent - 1) / (resizePercent / 100 * 2);
    if (resizePercent > arrBlocks.length) {
        for (let i = originalArrlength; i < resizePercent; i++) {
            arrBlocks.push(new Array());
            arrBuffer.push(new Array());
        }
        for (let i = 0; i < resizePercent; i++) {
            for (let j = 0; j < resizePercent; j++) {
                if (isNaN(arrBlocks[i][j])) {
                    arrBlocks[i][j] = 0;
                    arrBuffer[i][j] = 0;
                }
            }
        }
    }
    else {
        for (let i = 0; i < originalArrlength - resizePercent; i++) {
            arrBlocks.pop();
            arrBuffer.pop();
        }
    }
    cols = resizePercent;
}

function setup() {
    createCanvas(windowWidth, windowHeight - 54, WEBGL);
    output.innerHTML = 100 - slider.value + "%";
    outputScale.innerHTML = sliderScale.value + "%";
    resizeGrid(100);
    for (let i = 0; i < 100; i++) {
        arrBlocks[i] = new Array();
        arrBuffer[i] = new Array();
        for (let j = 0; j < 100; j++) {
            arrBlocks[i][j] = 0;
            arrBuffer[i][j] = 0;
        }
    }
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 54);
}

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var strengthDampening = slider.value / 100;
//Dampening slider
slider.oninput = function () {
    output.innerHTML = 100 - this.value + "%";
    strengthDampening = slider.value / 100;
}

var sliderScale = document.getElementById("myScaleRange");
var outputScale = document.getElementById("demoScale");

//Scale slider
sliderScale.oninput = function () {
    outputScale.innerHTML = this.value + "%";
    resizeGrid(this.value);
}

var sliderStrength = document.getElementById("myStrengthRange");
var outputstrength = document.getElementById("demoStrength");
outputstrength.innerHTML = sliderStrength.value;
var strengthMultiplier = sliderStrength.value - 0;;
//strength slider
sliderStrength.oninput = function () {
    outputstrength.innerHTML = this.value;
    strengthMultiplier = sliderStrength.value - 0;
}

var isChecked = document.getElementById("chkbox");
isChecked.oninput = function () {

}

function draw() {
    background(51);
    rotateX(PI / 3);
    translate(-center, -800 - 400, -200);
    frameRate(60);
    noStroke();
    for (var i = 1; i < arrBlocks.length - 1; i++) {
        beginShape(TRIANGLE_STRIP);
        for (var j = 1; j < arrBlocks.length - 1; j++) {
            fill(color(arrBlocks[j][i] + 50, arrBlocks[j][i] + 50, 150 + arrBlocks[j][i]));
            arrBuffer[i][j] =
                ((arrBlocks[i - 1][j] +
                    arrBlocks[i + 1][j] +
                    arrBlocks[i][j + 1] +
                    arrBlocks[i][j - 1]) / 2 - arrBuffer[i][j]);
            arrBuffer[i][j] = arrBuffer[i][j] * strengthDampening;
            vertex(j * scl, i * scl, arrBlocks[j][i]);
            vertex(j * scl, (i + 1) * scl, arrBlocks[j][i + 1]);
        }
        endShape();
        arrBlocks[arrBlocks.length - 1][i] = 0;
        arrBlocks[i][arrBlocks.length - 1] = 0;
    }
    var arrTemp = arrBlocks;
    arrBlocks = arrBuffer;
    arrBuffer = arrTemp;

    if (isChecked.checked) {
        if (frameCount % 3 == 0) {
            arrBlocks[Math.ceil(random(1, cols - 2))][Math.ceil(random(1, cols - 2))] = Math.ceil(random(50, strengthMultiplier));
        }
    }

    let x = Math.round(map(mouseX, 0, windowWidth, 1, cols - 6));
    let y = Math.round(map(mouseY, 0, windowHeight, 1, cols - 4));

    if (mouseIsPressed && mouseX <= windowWidth && mouseY >= 0 && mouseX >= 0) {
        for (let i = 0; i < 5; i++) {
            for (var j = 1; j < 5; j++) {
                if (y > cols - 6) { y = cols - 6 }
                arrBlocks[x + i][y + j] = strengthMultiplier;
            }
        }
    }

}
function resetArray() {
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < cols; j++) {
            arrBuffer[i][j] = 0;
            arrBlocks[i][j] = 0;
        }
    }
}
function boost() {
    for (var i = 1; i < cols - 1; i++) {
        for (var j = 1; j < cols - 1; j++) {
            arrBuffer[i][j] = 0;
        }
    }
}