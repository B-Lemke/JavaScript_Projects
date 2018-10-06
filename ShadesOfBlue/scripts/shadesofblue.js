/*Broderick Lemke, 2018 */


/*use specified width and height above to define canvas size, will effect the colors later on.
It is recommended to keep w and h in increments of 256 to play nicely with RGB values, but feel free to explore.
Smaller numbers give colors that are darker due to the smaller numer, 512 is optimal for full range color choices,
and high values of h and w will give brighter shades of color.  */
var h = 512;
var w = 512;

//Used to place circles randomly
var randh;
var randw;


function setup() {

  createCanvas(w, h);
  background(50);
  //no outlines on circles
  noStroke();
  frameRate(40);
}


function draw() {
  for (var i = 0; i < 500; i++) {
//set random x and y coords
    randh = random(0, h);
    randw = random(0, w);

//change color to be based upong the X and y values for R and G, with B amount being decided by an average of the x and y of the mouse
    fill(randw/2, randh/2, ((mouseX/2)+(mouseY/2))/2);

//draw the circle in the selected color.
    ellipse(randw, randh, randw/20, randh/20);
  }
}
