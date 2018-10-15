// - Trees
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


//wind noise variables
var soundNoise;
var noiseBtn;
var filter;
var noiseOsc;
var noiseOsc2;
var noiseOscAmp;
var noiseOscAmp2;
var feederFreq;
//var reverb;
var windWah;


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

    //set up wind variables
    windSpeed = 0;
    windAccel = 0;
    noiseInput = 0;


    //set up wind noise variables
    soundNoise = new p5.Noise();

    noiseOsc = new p5.Oscillator();
    noiseOsc.setType('sine');
    noiseOsc.freq(.3);
    noiseOsc.amp(1);
    noiseOsc.start();

    noiseOsc2 = new p5.Oscillator();
    noiseOsc2.setType('sine');
    noiseOsc2.freq(1);
    noiseOsc2.amp(.2);
    noiseOsc2.start();



    noiseOscAmp = new p5.Amplitude();
    noiseOscAmp.setInput(noiseOsc);

    noiseOscAmp2 = new p5.Amplitude();
    noiseOscAmp2.setInput(noiseOsc2);


    filter = new p5.BandPass();

    //reverb = new p5.Reverb();


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
            windSpeed = windSpeed + (windAccel - .5) * .01;
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


    feederFreq = Math.abs(noiseOscAmp2.getLevel());

    //prevent choppiness when the feeder frequency hits 0
    if (feederFreq != 0){
      noiseOsc.freq(feederFreq);
    } else{
      noiseOsc.freq(0.1);
    }
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
        soundNoise.stop()
    } else {
      // disconnect unfiltered noise,
      // and connect to filter

      soundNoise.disconnect();
      soundNoise.connect(filter);
      soundNoise.start();

    }

    windOn = !windOn;
    windSpeed = 0;
    windAccel = 0;


}


function panSound(panVal) {
    //console.log(panVal);
    soundNoise.pan(1 * panVal);
}

function updateNoise(windSpeed) {
    //console.log(windSpeed);
    windWah = noiseOscAmp.getLevel()/2;
    //console.log(windWah);

    filter.freq(400);
    if (windSpeed > 0) {
        filter.res(1 - windSpeed*10 - windWah);
      //  console.log(1 - windSpeed*10 + "Greater than 0");
    }
    else if (windSpeed <= 0) {
        filter.res(1 + windSpeed*10 + windWah);
      //  console.log(1 + windSpeed*10 + "less than 0");
    }

    //set amp/volume based on how strong the wind is
    soundNoise.amp(Math.abs(windSpeed));
    //reverb.set(10);
}
