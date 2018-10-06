//Authors: Anastasia Montavon and Broderick Lemke

var img;
var pixelObjects = [];

//For k-means
var centroids = [];

//calculate centroids again
var goAgain = false;

function preload(){
  img = loadImage('dog.jpg');
}

function setup() {
  //Pixel density to one to not fuck shit up
  pixelDensity(1);
  // put setup code here
  createCanvas(2000,1600);
  //paste image
  image(img, 0, 0);
  //copy canvas to pixel array

/*------------------------------------------------------------------------
Set Up Pixel Object Array
------------------------------------------------------------------------*/
  loadPixels();

  console.log(pixels);

  //which rgba are we on?
  var countRGB = 0;
  var countPixelNum = 0;

  //Loop through pixel array and pull into pixel pixelObjects
  for (i=0; i<pixels.length; i++){
    //loop through every pixel

    switch(countRGB) {
      case 0:
          //Add a new pixel object at this location
          pixelObjects[countPixelNum] = new pixelObject();
          //This is a red value
          pixelObjects[countPixelNum].r = pixels[i];
          break;
      case 1:
          //This is a green value
          pixelObjects[countPixelNum].g = pixels[i];
          break;
      case 2:
          //This is a blue value
          pixelObjects[countPixelNum].b = pixels[i];
          break;
      case 3:
          //This is an a value
          countPixelNum++;
          countRGB = -1;
          break;
      default:
          //throw error
          console.log("What is going on fam?");
          return;
      //end switch case
    }

    //Update counts
    countRGB++;

    //end assigning pixel objects

  }

  console.log(pixelObjects);

/*----------------------------------------------------------------------
Clusting using our understanding of K-means
----------------------------------------------------------------------*/
//Centroid time boissssss
  for (i=0;i<8;i++){
    //create all empty centroids
    centroids[i] = new centroid();
  }

//each corner
    centroids[0].construct(0,0,0);
    centroids[1].construct(0,0,255);
    centroids[2].construct(0,255,0);
    centroids[3].construct(0,255,255);
    centroids[4].construct(255,0,0);
    centroids[5].construct(255,0,255);
    centroids[6].construct(255,255,0);
    centroids[7].construct(255,255,255);


    for (i=0;i<pixelObjects.length;i++){
      var shortestDist = 10000000000000000000;
      var shortestPos;
      //for each pixel:
      for(j=0;j<centroids.length;j++){
        //for each centroid
        var thisDist
        thisDist= calcDist(pixelObjects[i].r, pixelObjects[i].g, pixelObjects[i].b, centroids[j].r, centroids[j].g, centroids[j].b);
        if (thisDist < shortestDist){
          shortestDist = thisDist;
          shortestPos = j;
        }
        pixelObjects.clusterNum = shortestPos;
      }
    }


    console.log(pixelObjects);
    console.log(calcDist(2,2,2,0,0,0));

  //end setup
}


function draw() {
  // put drawing code here
  image(img, 0, 0);
}


function pixelObject(){
  //pixel object to store data about each indidivual pixel
  this.r;
  this.g;
  this.b;
  this.clusterNum = 0;
}

function centroid(){
  this.r;
  this.g;
  this.b;

  //cunstructor function
  this.construct = function(r,g,b){
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

function calcDist(pixelR, pixelG, pixelB, centroidR, centroidG, centroidB){
  dist = Math.sqrt(pow((pixelR-centroidR),2)+pow((pixelG-centroidG),2)+pow((pixelB-centroidB),2));
  return dist;
}
