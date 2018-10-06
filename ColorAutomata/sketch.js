/*Broderick Lemke, 2018 */

//Note to self:try adding in limiters on how low cur R and cur B can go to keep it within a purple range, let G drop

var w = 1080;
var h = 680;

var scaleFac = 10; //How many pixels is each square?

var grid = []; //Array of squares

var squareW;
var squareH;

var weight = 7; //How weighted each pixel is in its color conformity

var paused = false; //Start the program on page load, switches to true when clicking pause

var brushSize = "small"; //control the number of pixels changed each click. Small is single pixel, medium 9, large 27

function setup() {
  //Create canvas and place it in div with id "sketch-holder"
  var canvas = createCanvas(w, h);
  canvas.parent('sketch-holder');

  //draw background grey
  background(50);
  pixelDensity(1);

  //Set framerate for stability
  frameRate(30);

  //find number of squares in the grid
  squareW = floor(w/scaleFac);
  squareH = floor(h/scaleFac);

//set up the grid of squares
  for (var i = 0; i < squareH; i++) {
    for (var j = 0; j < squareW; j++) {
      //new square object
      var newSquare = new square();
      //construct the object at point j,i with a random RGB
      newSquare.construct(j, i, random(0,255),random(0,255),random(0,255));
      //add to array in grid
      grid.push(newSquare);
    }
  }
//establish the neighbor arrays for each pixel
  for (var i = 0; i < grid.length; i++) {
    grid[i].establishNeighbors();
  }
}

function draw() {
//p5.js loop, runs unless noLoop() is specified;

  if (!paused){
  //caluclate the new color values if not paused
    for (var i = 0; i < grid.length; i++) {
      grid[i].weightAverage(i);
    }
  }

// update color and redraw on the screen
  for (var i = 0; i < grid.length; i++) {
    grid[i].updateColor();
    grid[i].show();
  }
}

function square(){
//Square Object
  this.construct = function(x,y,r,g,b){
    //create values of the individual squares
    this.x = x;
    this.y = y;

    this.curR = r;
    this.curG = g;
    this.curB = b;
    this.nextR; //left empty, will be used in the weightAverage function and updateColor function
    this.nextG;
    this.nextB;

    this.neighbors = []; //array listing the location in the grid array of the neighbors.
  }

  this.show = function(){
    //draw each square in pixels
    var col = color(this.curR, this.curG, this.curB);
    noStroke();
    fill(col);
    rect(this.x*scaleFac, this.y*scaleFac, scaleFac, scaleFac);
  }

  this.establishNeighbors = function (){
    //Find the neighbors of this pixels, store them in an array
    var pos = this.x + (this.y * squareW); //Find the square's location in the one dimensional grid array

    //Find the neighbors, note that if there is not a neighbor of that type it is stored as null

    //Upper Left neighbor
    if (this.y != 0 && this.x !=0){
      this.neighbors.push(pos-squareW-1);
    } else {
      this.neighbors.push(null);
    }

    //Upper neighbor
    if (this.y != 0){
      this.neighbors.push(pos-squareW);
    } else{
      this.neighbors.push(null);
    }

    //Upper Right neighbor
    if (this.y != 0 && this.x !=squareW-1){
      this.neighbors.push(pos+1-squareW);
    } else {
      this.neighbors.push(null);
    }

    //Right neighbor
    if (this.x != squareW-1){
      this.neighbors.push(pos+1);
    } else {
      this.neighbors.push(null);
    }
    //Lower Right Neighbor
    if (this.x != squareW-1&& this.y != squareH-1){
      this.neighbors.push(pos+1+squareW);
    } else {
      this.neighbors.push(null);
    }

    //Lower neighbor
    if (this.y != squareH-1){
      this.neighbors.push(pos+squareW);
    } else {
      this.neighbors.push(null);
    }
    //Lower Left Neighbor
    if (this.y != squareH-1&&this.x!=0){
      this.neighbors.push(pos-1+squareW);
    } else {
      this.neighbors.push(null);
    }

    //left neighbor
    if (this.x != 0) {
      this.neighbors.push(pos-1);
    } else {
      this.neighbors.push(null);
    }

  }

  this.weightAverage = function(currentspot){

    var internalWeight = 0;
    var internalR = 0;
    var internalG = 0;
    var internalB = 0;

    var neighborColors = grid[currentspot].neighbors;

    //add the RGB values into the total for a weighted average, ignore if null
    for (var i = 0; i < neighborColors.length; i++) {
      if (neighborColors[i] != null){
        var spot = neighborColors[i];
        internalWeight++;
        internalR += grid[spot].curR;
        internalG += grid[spot].curG;
        internalB += grid[spot].curB;
      }
    }

    internalWeight += weight; //Add the weight for the current cell
    //add current value times weight
    internalR += this.curR * weight;
    internalG += this.curG * weight;
    internalB += this.curB * weight;



    //set the next color value to the weighted weightAverage
    this.nextR = internalR / internalWeight;
    this.nextG = internalG / internalWeight;
    this.nextB = internalB / internalWeight;

  }

  this.updateColor = function(){
    //move the next values into the current values
    this.curR = this.nextR;
    this.curG = this.nextG;
    this.curB = this.nextB;
  }


}


function pause(){
  //turn on or off the checking of neighbors and updating
  if (!paused){
    paused = true;
  } else {
    paused = false;
  }
}

function randomizePixels(){
  //redraw the canvas with random colored pixels
  for (var i = 0; i < grid.length; i++) {
    grid[i].curR = random(0,255);
    grid[i].curG = random(0,255);
    grid[i].curB = random(0,255);
    grid[i].nextR = random(0,255);
    grid[i].nextG = random(0,255);
    grid[i].nextB = random(0,255);
  }
}

function clearAll(){
  //set all pixels to grey
  for (var i = 0; i < grid.length; i++) {
    grid[i].curR = 128;
    grid[i].curG = 128;
    grid[i].curB = 128;
    grid[i].nextR = 128;
    grid[i].nextG = 128;
    grid[i].nextB = 128;
  }
}

function mouseClicked() {
  //if the mouse is clicked
  //Get the color in the color picker
  var colorPicked = document.getElementById("colorPicker").value;
  //Update Brush Size
  brushSize =  document.getElementById("brushSize").value;

  //set RGB values based off of color picker
  var redVal = red(colorPicked);
  var greenVal = green(colorPicked);
  var blueVal = blue(colorPicked);


  //find where the mouse is
  var curX = mouseX;
  var curY = mouseY;



  if (curX <= w && curX >=0 && curY >=0 && curY <= h){
    //if on the canvas, find the x,y of the pixel
    gridX = floor(curX/scaleFac);
    gridY = floor(curY/scaleFac);

    //find place in grid array
    var pos = gridX + (gridY * squareW);


    //if within the grid:
    if (pos<grid.length) {
      //find the neighbors of neighbors and set them to the current color selected

      if (brushSize=="large"){
      for (var i = 0; i < grid[pos].neighbors.length; i++) {
          //take the neighbors of the pixel clicked on
          var neighborOne = grid[pos].neighbors[i];
          //if not null (edge case), continue, otherwise move on to the next pixel in the original pixel's neighbors
          if (neighborOne != null){
          for (var j = 0; j < grid[neighborOne].neighbors.length; j++) {
            //get the neighbor of the neighbor
            var neighborPos = grid[neighborOne].neighbors[j];
            //if not null, set its RGB values to those of the color picker
            if (neighborPos != null){
              grid[neighborPos].curR = redVal;
              grid[neighborPos].nextR = redVal;
              grid[neighborPos].curG = greenVal;
              grid[neighborPos].nextG = greenVal;
              grid[neighborPos].curB = blueVal;
              grid[neighborPos].nextB = blueVal;
              }
            }
          }
        }
      } else if (brushSize=="medium") {
        for (var i = 0; i < grid[pos].neighbors.length; i++) {
            //take the neighbors of the pixel clicked on
            var neighborPos = grid[pos].neighbors[i];
              //if not null (edge case), continue, otherwise move on to the next pixel in the original pixel's neighbors
              if (neighborPos != null){
                grid[neighborPos].curR = redVal;
                grid[neighborPos].nextR = redVal;
                grid[neighborPos].curG = greenVal;
                grid[neighborPos].nextG = greenVal;
                grid[neighborPos].curB = blueVal;
                grid[neighborPos].nextB = blueVal;
              }
          }
      }


      //set the current pixel to the current color
      grid[pos].curR = redVal;
      grid[pos].nextR = redVal;
      grid[pos].curG = greenVal;
      grid[pos].nextG = greenVal;
      grid[pos].curB = blueVal;
      grid[pos].nextB = blueVal;
    }
  }
}

function mouseDragged() {
  //run the function for mouse clicked
  mouseClicked();
}
