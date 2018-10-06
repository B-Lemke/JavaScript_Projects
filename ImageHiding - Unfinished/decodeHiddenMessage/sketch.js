/*Broderick Lemke, 2018 */


/*

  */

var h;
var w;

var imgOriginal;
var imgMessage;

var pixelStorageOrig = [];
var pixelStorageMessage = []; //For testing purposes. This is the pixels being used for imgMessage.

var txtMessage = "";
var message = "";

function preload() {
  imgOriginal = loadImage('imgbefore.png'); //load the original image
  imgMessage = loadImage('imgfinal.png'); //load the encoded image
}

function setup() {
  pixelDensity(1);
  h = imgOriginal.height;
  w = imgOriginal.width;
  createCanvas(w*2, h);
  background(50);
  image(imgOriginal, 0, 0);
  image(imgMessage, w, 0);
}


function draw() {
  noLoop();
}

function decodeImages() {

  //copy image pixels into the two arrays
  imgOriginal.loadPixels();
  pixelStorageOrig = imgOriginal.pixels.slice();
  imgOriginal.updatePixels();
  console.log("Pixel storage original");
  console.log(pixelStorageOrig);

  imgMessage.loadPixels();
  pixelStorageMessage = imgMessage.pixels.slice();
  imgMessage.updatePixels();
  console.log("Pixel storage message:");
  console.log(pixelStorageMessage);


    console.log("1693:");
    console.log(pixelStorageOrig[1693]);
    console.log(pixelStorageMessage[1693]);

  for (var i = 0; i < pixelStorageMessage.length; i++) {
    if (pixelStorageOrig[i] - pixelStorageMessage[i] == -1){
        //If the original character was 1
        message = message + "1";
    }
    else if (pixelStorageOrig[i] - pixelStorageMessage[i] == 1){
      //if the original character was 0
        message = message + "0";
    } else if (i<2000){
      console.log("Original");
      console.log(pixelStorageOrig[i]);
      console.log("Message");
      console.log(pixelStorageMessage[i]);
      console.log("i");
      console.log(i);
    }

  }

document.write(message);
}
