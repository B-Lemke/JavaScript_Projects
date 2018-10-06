/*Broderick Lemke, 2018 */

//prepaer width and height
var w;
var h;

var img;

//create an array of the bubbles
var bubbles = [];

var prevBubbles = []; //holds past generations

var life = []; //Used to store alpha values of arrays
var lifeCycle = 1; //amount of alpha down each frame

var alpha; // current alpha

var maxBubs = 300; //just to stop it from adding too many bubbles





function preload() {
  //preloads the image
    img = loadImage("data/headshot.jpg");
}


function setup() {

 img.loadPixels();

 var density = displayDensity();
 pixelDensity(1);

//set canvas size to image size.
w = img.width/2;
h = img.height/2;

  createCanvas(w, h);

  background(50);



  //no outlines on circles
  stroke(255);
  noFill();
}


function draw() {

  background(50);

//draw previous bubbles, update their life, each generation stored in a nested array
  for (var i = 0; i < prevBubbles.length; i++) {
    life[i]-= lifeCycle; //Lower the life value of the current generation by life cycle
     if (life[i]<=0){ //if life is up
       prevBubbles.splice(i,1); //remove this element
       life.splice(i,1); //remove this element
       print(prevBubbles.length); //display for testing
     }

    alpha=life[i]; //set the alpha to the current life cycle
    if (!prevBubbles.length<=0){
      for (var j = 0; j < prevBubbles[i].length; j++) {
        //show all previous bubbles
        var prevBub = prevBubbles[i][j];
        prevBub.show(life[i]);
      }
    }
  }


  frameRate();
  //number of bubbles to create each frame
  var numBubbles = 10;
  var count = 0; //total number of bubbles added this frame so far
  var attempts = 0; //number of times createBubble() has returned null, aka there wasn't a space for a new bubble

  if (bubbles.length > maxBubs){
    //exit condition if more than maximum bubbles on screen
    print("Max Bubbles Reached");
    newGen();
  }



  //while count is less that number of bubbles, add a new bubble to the bubbles array.
  while (count<numBubbles){

    var result = createBubble();
    //create a new bubble

    if (result !== null){
      //if bubble is valid, add it to the array bubbles
    bubbles.push(result);
    count++;
    }
    else {
      //if not a valid bubble, up the attempts counter.
      attempts++;
    }

    if (attempts > 5000){
      //exit condition if it can't find a place for another bubbles, however many times
      print("No more spots");
      noLoop();
      break;
    }
  }

//  curPlace = 0; //Set the current place to start at the beginning of the array
  for (var i = 0; i < bubbles.length; i++) {
      var currentBubble = bubbles[i];
      //check if the current bubble is touching the edge of the screen, edges returns true if it is
      if(currentBubble.edges()){
        currentBubble.growing = false;
      }

      // start comparing current bubble to every other bubble in the bubbles array
      for (var j = 0; j <bubbles.length; j++) {
        //don't compary with itself
        if (j <= bubbles.length && i != j){
          var other = bubbles[j]; //temporary holding for the comparrison bubble
          var d = dist(currentBubble.x, currentBubble.y, other.x, other.y); //distance between the bubbles

          //distance between two touching circles is their radii
          var maxdist = currentBubble.r + other.r;

          if (d< maxdist) {
            //if the bubbles are too close, stop current from growing, the other bubble will stop when it is its turn too.
            currentBubble.growing = false;
            break;
          }

        }


      }
      //reset alpha for current bubbles
      alpha = 255;
      //grow the bubbles out one pixel and draw to the screen
      currentBubble.grow();
      currentBubble.show();

      //curPlace++; //Start the searching ignoring objects that have been compared using curPlace
  }


}

function bubble(){

  this.edges = function(){
    //if bubble is touching the edge, return true
    return (this.y + this.r >= h || this.y - this.r <= 0 || this.x + this.r >= w || this.x - this.r <=0)
  }


  this.grow = function() {
    //if bubble is still growing, add 0.5 to the radius
    if(this.growing){
      this.r+= 0.5;}
  }

  this.show = function() {
    //draw the bubbles
    noStroke();


    var r = red(this.col); //P5.js was being grumpy when I tried to just add an alpha channel to the color so I had to break it apart and re-pack
    var g = green(this.col);
    var b = blue(this.col);

    this.col = color(r,g,b,alpha);

    fill(this.col);
    ellipse(this.x ,this.y, this.r*2, this.r*2);
  }

  this.setup = function(x_, y_, r_){
    //Set this bubble's w y and r from the createBubble function
    this.x = x_;
    this.y = y_;
    this.r = r_;


    //Find the color of the pixel in the image at this spot and set the circle to that.
    var index = (x*2 + (y*2 * img.width)) *4 ;
    var r = img.pixels[index];
    var g = img.pixels[index+1];
    var b = img.pixels[index+2];

    this.col = color(r,g,b);
    //bubble starts off growing
    this.growing = true;
  }

}

function createBubble() {
  //This function creates an x,y, and r value for a bubble. It will check if it is overlapping with another bubble already in existence. It returns null if it overlaps, it returns the new bubble object (already setup)
  x = floor(random(w));
  y = floor(random(h));
  //starting radius of the bubble will be random number
  r = floor(random(10));

  var valid = true;

  for (var i = 0; i < bubbles.length; i++) {
    var checkBub = bubbles[i];

    //find how far out the bubble goes
    var distance = dist(x, y, checkBub.x, checkBub.y);

    //If the distance between the random x,y and the bubble is less than the radius, this is not a valid bubble
    if (distance < checkBub.r + r){
      valid = false;
    }

  }

  //use overlapping result
  if (valid){

    //if bubble is not overlapping
    var newBubble = new bubble;
    newBubble.setup(x,y,r);
    return newBubble;
  } else if (!valid) {
    //if bubble is overlapping, return null
    return null;
  }
}

function newGen(){


  var tempArray = [];
  tempArray = bubbles.slice(0); //copy bubbles
  prevBubbles.push(tempArray); //add tempArray to prevBubbles as another array
  life.push(255); //add a life value to life array
  bubbles = []; //reset bubbles

}
