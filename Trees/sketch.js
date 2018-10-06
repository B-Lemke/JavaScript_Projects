//Broderick LEmke - Trees
//set the width and height
var canvasWidth = 800;
var canvasHeight = 800;

var firstBranchLength = 200;

var rightAngleSlider;
var leftAngleSlider

var lineWidth = 20;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  background(50);

  //add empty paragraph below canvas for spacing
  createP('Left Branch Angle:');

  //create slider to adjust branchAngle
  //minVal, maxVal, startVal, stepSize
  leftAngleSlider = createSlider(0, 2*PI, PI/8, PI/32);

  createP('Right Branch Angle')
  rightAngleSlider = createSlider(0, 2*PI, PI/8, PI/32);
}

function draw() {
  //redraw background
    background(50, 50, 50, 150);

    //place origin point at bottom middle for the first branch
    translate(canvasWidth/2, canvasHeight);
    strokeWeight(lineWidth);
    //stroke set to white
    stroke(255);
    drawBranch(firstBranchLength, lineWidth);
}

function drawBranch(length, branchWidth){
  //draw branch at current translation point

  if(length > 5)
  {
    branchWidth= branchWidth*.7;
    strokeWeight(branchWidth);
    //draw current branch
    line(0,0,0,-length);

    // change translation point to end of branch
    translate(0,-length);

    //rotate to the right and Recursively drow right branch
    push();
    rotate(rightAngleSlider.value());
    drawBranch(length*0.7, branchWidth);
    pop();

    /*
    Note on push and pup functions.
    They save current styling effects including the rotation and trasnlation points.
    The we save the current location and translation to return to when we draw the right branch's matching left branch
    Once the length is too short for the recursive function, we pop back the last settings to draw a left branch.
    */

    //rotate to the left and Recursively drow left branch
    rotate(-leftAngleSlider.value());
    drawBranch(length*0.7, branchWidth);
    //
  }
}
