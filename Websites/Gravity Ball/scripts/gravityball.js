/*Broderick Lemke, 2018
Gravity simulation with bouncing ball

Note:
(0,0) is the (x,y) of the top-left corner
*/


//canvas size;
var w = 1440;
var h = 480;


var b; //Object b will be the ball
var br; //This is the radius of the ball set in createScreen()


//line height, and length, set during createScreen()
var lh;
var ll;

//Ball x, y
var by;
var bx;

//variables to the RGB colors
var red;
var green;
var blue;


function setup() {


  createCanvas(w, h); //p5.js way to create an HTML canvas.
  background(0); //Set background to black
  b = new ball(); //create a the ball(b)

  createScreen(); //Draw the screen with the line and the ball
}


function draw() {
  background(0); //Cover the whole image with black
  stroke(red,green,blue); //Set the color of the stroke to be the color of the ball
  line(0,lh,ll,lh); //Draw the line based on given line height and length
  noStroke(); //Remove the stroke, so that there are no outlines
  b.move(); //move the ball

  b.display(); //Show the ball
}

function ball(){
//This is the object, ball. It has the methods move, display, and setup. The set-up is the constructor
  this.move = function(){
    //Moves the ball based on speed, and checks for collisions
    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;

    if (this.x >= ll){
      //If not on the line+5 pixels for a gap, increase the frames the ball has been falling by one. This is the time 'gravity' has been pulling it down
      this.fallingtime++;
    }

    if (this.fallingtime>= 1){
      //if ball is falling, increase the falling by using the basic kinematic equation
      // vf = vi + a(t); with t being subsituted as number of frames instead of seconds.
      this.yspeed = this.yspeed + (this.a * this.fallingtime);
    }

    if (this.y+this.radius > h && this.yspeed > 0) { //checks if it 'hits' the bottom of the screen

      //make the ball bounce up or down if it hits the bottom of the screen
     this.yspeed = -1*(this.yspeed/2.5); //reverse the velocity
     this.fallingtime = 10; //I was getting errors without resetting the falling time to a lower value

     colorChange(); //each bounce, change color of the Ball

     //If ball is already bouncing really small amounts, no bounce, prevents visual stutter
      if (this.yspeed > -1){
        this.yspeed=0;
        }
    }

    if (this.x > w+br){
      //If the ball goes off screen, redraw the screen with a new line and new ball
      createScreen();
    }
  }

  //show the ball
  this.display = function() {
    ellipse(this.x, this.y, this.radius*2, this.radius*2);
  }



  this.setup = function(){
      //Ball Class setup
      this.x = bx; //X location of the center
      this.y = by; // Y location of the center
      this.radius = br; //The radius of the ball
      this.xspeed = random(5,20); //The speed it moves to the right
      this.yspeed = 0; //initially zero because the ball is 'supported' by platform

      this.fallingtime = 0; //how many frames the object has been falling
      this.a = .03; //Acceleration, similar to the g constant in physics.
    }

}

function createScreen () {
  //at the Setup and any time offscreen, recreate the ball and line with new values
  br = floor(random(3,20)); //Pick a random radius as a whole-number between 3 and 20
  lh = random(100, 300); //Pick a random line height between 100 and 300
  bx = br; //The x location to start the ball is the width of the radius, starting it fully on screen.
  by = lh-br; //The ball's Y  is the line's height, minus the ball's radius.
  ll = random(50,200); //Change the length of the platform

  colorChange(); //Change the colors

  b.setup(); //Setup the ball with new values
}

function colorChange () {
  //Change the color of the ball, called when creating new ball and bouncing
  red = random (100,256);
  green = random (100,256);
  blue = random (100,265);

  fill(red,green,blue);
}
