var sourceImage;

var balls = [];
var numBalls = 5000;

var maxMovement = 3;
var maxRadius;

var imgURL;
var globalAlpha = 55;

var newDay;
var newMonth;
var newYear;

var notDoubled = true;


function preload(){
  //Get info from the NASA api.
  newImage();
}


function setup() {
  //get rid of loading loadingMessag
  var element = document.getElementById("loadingMessage");
  element.parentNode.removeChild(element);


  //setup will change the dafault size of the canvas even though is specifice in the newImage(). Resize it properly for the first one
  var cnv = createCanvas(sourceImage.width, sourceImage.height);

  //put canvas in sketch holder div
  cnv.parent('sketch-holder');

}

function draw() {
  //Go through each ball and update it's new position, display it and check if it's big enough otherwise remove it from array
  for (var i = 0; i < balls.length; i++) {
    balls[i].updatePosition();
    balls[i].displayBall();

    if (balls[i].radius < .5){
      //if ball too small, remove it
      balls.splice(i, 1);
    }
  }


  console.log(balls.length);

  //when out of balls
  if (balls.length == 0 && notDoubled){
    //stop looping if no more balls left

    //was getting an odd error where this code would run twice. This variable stops that

    notDoubled = false;

    noLoop();
    console.log("Done");
    //pick new image after 5 seconds
    setTimeout(function(){newImage();}, 5000);
  }
}

function ball(){
  //constructor
  this.x = Math.floor(random(sourceImage.width));
  this.y = Math.floor(random(sourceImage.height));
  this.radius = random(maxRadius);

  //function to move its x and y
  this.updatePosition = function(){
    //move up or down 1
    this.x = this.x + Math.floor(random(-maxMovement, maxMovement+1));
    this.y = this.y + Math.floor(random(-maxMovement, maxMovement+1));

    if(this.x < -this.radius || this.x > sourceImage.width + this.radius || this.y < -this.radius || this.y > sourceImage.height + this.radius){
      //if out of bounds, pick new x and y;
      this.x = Math.floor(random(sourceImage.width));
      this.y = Math.floor(random(sourceImage.height));
    }
    //optional code to increase size over time
    this.radius = this.radius * 0.99;
  }

  this.displayBall = function (){
    var index = (this.y*sourceImage.width + this.x)*4;
    var r = sourceImage.pixels[index];
    var g = sourceImage.pixels[index+1];
    var b = sourceImage.pixels[index+2];

    var c = color(r, g, b, globalAlpha);

    fill(c);

    ellipse(this.x, this.y, this.radius);
  }

}

function displayErrorScreen(){
  console.log("Whoops");
  createCanvas(400,400);
  background(0);
  textSize(32);
  fill(255);
  text("Error, try again later!", 100, 100);
  noLoop();
}






function getNewNASADate(){

  /////////////////////////////////////////////////////
  // Random APOD Date Generator                      //
  // by Geckzilla aka Judy Schmidt www.geckzilla.com //
  // Copy it, share it, modify it--I don't mind.     //
  /////////////////////////////////////////////////////

  var now = new Date(); //right now
  var min = new Date(1995, 5, 16).getTime(); // 1995 June 16 00:00:00, the first APOD
  var max = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 18, 59, 59, 999).getTime(); // now converted UTC time at 03:59:59.999

  //taking off 6 hours because APOD goes by east coast USA time.
  //should be enough to keep anyone from landing on future APODs which won't be published yet in their timezone
  //unless their computer clock is set way off, then they'll get 404's all the time probably
  max = max-(5*60*60*1000);


  var random_date = Math.round(min+(Math.random()*(max-min))); //ahh, a random APOD date!

  //but wait...
  //there's one section of missing APODs in the history of APODs
  //that's the first three days after the very first APOD was posted
  //June 17th, 18th, & 19th, 1995
  var missing_min = new Date(1995, 5, 17).getTime(); //1995 June 17 00:00:00
  var missing_max = new Date(1995, 5, 19, 23, 59, 59, 999).getTime(); //1995 June 19 23:59:59.999

  //if our random date falls in this range, remake it.
  while(random_date >= missing_min && random_date <= missing_max) {
  	random_date = Math.round(min+(Math.random()*(max-min)));
  }

  //convert the timestamp back into a date object
  random_date = new Date(random_date);
  newYear = random_date.getFullYear().toString().slice(-4); //in the year 2095 we're gonna have problems
  newMonth = (0+(random_date.getMonth()+1).toString()).slice(-2); //zero pad the month
  newDay = (0+(random_date.getDate().toString())).slice(-2); //zero pad the day

}

function newImage(){
  console.log("Getting image");
  getNewNASADate();
  var apiURL = 'https://api.nasa.gov/planetary/apod?api_key=py9yOVmf7v7jKOqbzWZ6uR1KqhxhBWhJhj0JkLxG&date=' + newYear + '-' + newMonth + '-' + newDay;
  //Broken link for testing:
  //apiURL = "https://api.nasa.gov/planetary/apod?api_key=py9yOVmf7v7jKOqbzWZ6uR1KqhxhBWhJhj0JkLxG&date=2014-01-12"
  var spaceImage = loadJSON(apiURL,function(){
    console.log("Loading JSON: " + spaceImage);
    //once the JSON has been loaded, callback to this function and loas the image into the source image variable
    imgURL = spaceImage.hdurl;
    sourceImage = loadImage(imgURL, function(){
      console.log("Image loaded");
      console.log(sourceImage);
        console.log(spaceImage);
        setupCanvas(spaceImage);

    });

  },
  //if the JSON can't be loaded, call this function again to get a new URL for the JSON
  function(){newImage();});



}

function setupCanvas(spaceImage){
  //remove old canvas

  console.log("Starting setup");
  console.log(sourceImage);

  //size before:
  console.log("Before: " + sourceImage.width + "            " + sourceImage.height);

  checkImageTooBig();

  //size after
  console.log("After " + sourceImage.width + "            " + sourceImage.height);
  var cnv = createCanvas(sourceImage.width, sourceImage.height);

  //put canvas in sketch holder div
  cnv.parent('sketch-holder');

  background(0);
  sourceImage.loadPixels();
  noStroke();

  maxRadius = sourceImage.width/10;

  setNumBalls();

  //make balls
  for (var i = 0; i < numBalls; i++) {
      var newBall = new ball();
      balls.push(newBall);
    }

    notDoubled = true;

  //restart loop if turned off
  loop();

  //Display photo info
  document.getElementById('title').textContent = spaceImage.title;
  document.getElementById('date').textContent = spaceImage.date;
  document.getElementById('explanation').textContent = spaceImage.explanation;

  //remove old link
  var myNode = document.getElementById("normalImage");
   myNode.removeChild(myNode.firstChild);

  //provide link to image
  var a = document.createElement('a');
    a.setAttribute('href',spaceImage.hdurl);
    a.innerHTML = "[Link]";
    myNode.appendChild(a);

    //if there is a copyright, add it
    if (spaceImage.copyright !== undefined){
        document.getElementById('copyright').textContent = " \u00A9 Copyright: " + spaceImage.copyright;
    }
    else{
      console.log("No copyright");
    }
}



function checkImageTooBig(){
  //Check to see if the image is too big for the current window size
  if(sourceImage.width > window.innerWidth){
    //image bigger than displayErrorScreen
    sourceImage.resize( window.innerWidth - 300, 0);
  }
  if(sourceImage.height > window.innerHeight){
    sourceImage.resize( 0, window.innerHeight - 300);
  }
}

function setNumBalls(){
  //set the number of balls to be proportional to the size of the image. Use the largest dimension
  if(sourceImage.width > sourceImage.height){
    numBalls = sourceImage.width * 3;
    console.log("Num of balls: " + numBalls);
  } else{
    numBalls = sourceImage.height * 3;
        console.log("Num of balls: " + numBalls)
  }
}
