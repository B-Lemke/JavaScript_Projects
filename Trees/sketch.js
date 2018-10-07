//Broderick LEmke - Trees
//set the width and height
var canvasWidth = 800;
var canvasHeight = 800;

var firstBranchLength = 220;

var rightAngleSlider;
var leftAngleSlider

var lineWidth = 20;

var windSpeed;
var blowPos = true;
var windOn = false;
var windBtn;

var noiseInput;
var noiseOutput;

var windAccel = 0;



var soundNoise;
var noiseBtn;
var filter;
var noiseOsc;
var noiseOscAmp;
var reverb;


function setup() {
    createCanvas(canvasWidth, canvasHeight);
    background(50);

    //add empty paragraph below canvas for spacing
    createP('Left Branch Angle:');

    //create slider to adjust branchAngle
    //minVal, maxVal, startVal, stepSize
    leftAngleSlider = createSlider(0, 2 * PI, PI / 8, PI / 32);

    createP('Right Branch Angle')
    rightAngleSlider = createSlider(0, 2 * PI, PI / 8, PI / 32);

    //create
    windBtn = createButton('Toggle Wind');
    //when wind button is pressed, run function toggle wind
    windBtn.mousePressed(toggleWind);

    frameRate(20);

    windSpeed = 0;
    windAccel = 0;

    noiseInput = 0;

    soundNoise = new p5.BandPass()
    noiseBtn = createButton('Noise');
    noiseBtn.mousePressed(playNoise);

    soundNoise = new p5.Noise();

    noiseOsc = new p5.Oscillator();
    noiseOsc.setType('sine');
    noiseOsc.freq(.1);
    noiseOsc.amp(1);
    noiseOsc.start();

    noiseOscAmp = new p5.Amplitude();
    noiseOscAmp.setInput(noiseOsc);

    filter = new p5.BandPass();

    reverb = new p5.Reverb();


}

function draw() {
    //redraw background
    background(50, 50, 50, 255);

    //advance this far ahead in the perlin noise
    noiseInput += 0.03;
    //get new perlin noise number into wind accel

    //adjust wind if it's turned on
    if (windOn) {
        //adjust wind acceleration first

        //get new acceleration value, returns a digit between 0 and 1. Subtract .5 to get a range between -.5 and .5
        windAccel = noise(noiseInput);

        //accelerate the wind if not at it's max value
        if (windSpeed <= .1 && windSpeed >= -.1) {
            windSpeed = windSpeed + (windAccel - .5) * .005;
        } else if ( (windSpeed >= .1 && windAccel <= .5) || (windSpeed <= -.1 && windAccel >= .5) ) {
             //if wind is at an extreme but wants to blow the other way, let it
            windSpeed = windSpeed + (windAccel - .5) * .005;
        } else {
            //getting near an extreme, very small changes
            windSpeed = windSpeed + (windAccel - .5) * .00001;
        }

        panSound(windSpeed * 10);

        fill(255)
        text("Wind Speed: " + floor(windSpeed * 1000) + "km", canvasWidth - 120, canvasHeight-10);
    }

    //place origin point at bottom middle for the first branch
    translate(canvasWidth / 2, canvasHeight);
    strokeWeight(lineWidth);
    //stroke set to white
    stroke(255);
    drawBranch(firstBranchLength, lineWidth);

    //console.log(noiseOscAmp.getLevel());
    updateNoise(windSpeed);



}

function drawBranch(length, branchWidth) {
    //if this branch isn't too small
    if (length > 5) {
        branchWidth = branchWidth * .7;
        strokeWeight(branchWidth);
        //draw current branch
        line(0, 0, 0, -length);

        // change translation point to end of branch
        translate(0, -length);

        //rotate to the right and Recursively drow right branch
        push();
        rotate(rightAngleSlider.value() + windSpeed);
        drawBranch(length * 0.7, branchWidth);
        pop();

        /*
        Note on push and pop functions.
        They save current styling effects including the rotation and trasnlation points.
        The we save the current location and translation to return to when we draw the right branch's matching left branch
        Once the length is too short for the recursive function, we pop back the last settings to draw a left branch.
        */

        //rotate to the left and Recursively drow left branch
        rotate(-leftAngleSlider.value() + windSpeed);
        drawBranch(length * 0.7, branchWidth);
        //
    }
}

function toggleWind() {
    if (windOn) {
        //if wind is on, turn off the sound

    } else {

    }

    windOn = !windOn;
    windSpeed = 0;
    windAccel = 0;
}


function panSound(panVal) {
    //console.log(panVal);
    soundNoise.pan(-1 * panVal);
}

function playNoise() {

    // disconnect unfiltered noise,
    // and connect to filter
    soundNoise.disconnect();
    soundNoise.connect(filter);
    soundNoise.start();

    reverb.process(soundNoise);

    filter.freq(noiseOscAmp.getLevel()*100);
    filter.res(noiseOscAmp.getLevel()/10);
}

function updateNoise(windSpeed) {
    console.log(windSpeed);
    filter.freq(400);
    if (windSpeed > 0) {
        filter.res(1 - windSpeed*10);
        console.log(1 - windSpeed*10 + "Greater than 0");
    }
    else if (windSpeed <= 0) {
        filter.res(1 + windSpeed*10);
        console.log(1 + windSpeed*10 + "less than 0");
    }

    soundNoise.amp(Math.abs(windSpeed * 10));
}