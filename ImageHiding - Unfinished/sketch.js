/*Broderick Lemke, 2018 */


/*

  */

var h;
var w;

var imgbefore;
var imgfinal;

var pixelsStorage = [];
var pixelsStorage2 = [];

var txtMessage = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
var message = "";

function preload() {
  imgbefore = loadImage('headshot.jpg'); //load the image

}

function setup() {
  pixelDensity(1);
  h = imgbefore.height;
  w = imgbefore.width;
  createCanvas(w*2, h);
  background(50);
  image(imgbefore, 0, 0);


  convertMessage(txtMessage); //convert message to binary

  findPixels();

  image(imgfinal, w, 0);
}


function draw() {
  noLoop();
}

function findPixels() {
  //Encoding the message in the image
  imgbefore.loadPixels();
  pixelsStorage = imgbefore.pixels.slice(); //make a copy of the original pictures

  if(imgbefore.pixels.length < message.length){
    //If the message is too long, exit the funciton, don't bother
    alert('Error, message too long');
    return;
  }


  for (var i = 0; i < message.length; i++) {
    var curChar = message.charAt(i);

    replacePixel(curChar, i); //replace the pixel according to the character
  }

  pixelsStorage2 = imgbefore.pixels.slice(); //Make a copy of the new updated pixels

  console.log("PixelsStorage2");
  console.log(pixelsStorage2);

  console.log("PixelsStorage");
  console.log(pixelsStorage);

  imgbefore.updatePixels();
  imgfinal = imgbefore.get(); //make a copy of the imgbefore into the imgfinal

  imgbefore.loadPixels();
  //Resotre original image
  for (var i = 0; i < pixelsStorage.length; i++) {
    imgbefore.pixels[i] = pixelsStorage[i];
  }
  imgbefore.updatePixels();
  image(imgbefore, 0,0,);



}

function replacePixel(charVal,curIndex){
  //charVal is either a 1 or a 0 in binary. cur index is the spot in the message AND pixels array
  if (charVal == 1){
    //check if the original value is 255, the  maixmum already, replace it with one below in the original image
    if (pixelsStorage[curIndex] == 255) {
      pixelsStorage[curIndex] = 254;

    }
    imgbefore.pixels[curIndex] = pixelsStorage[curIndex] + 1; //replace the pixel with a value one greater
  }
  else if (charVal == 0){
    //check if the original value is 0, the  minimum already, replace it with one above in the original image
    if (pixelsStorage[curIndex] == 0) {
      pixelsStorage[curIndex] = 1;
    }
    imgbefore.pixels[curIndex] = pixelsStorage[curIndex] - 1; //replace the pixel with a value one less
  }

}

function convertMessage(txtMessage) {

    for (i = 0; i < txtMessage.length; i++) {

      var padding = "00000000";
      var binForChar = txtMessage[i].charCodeAt(0).toString(2);

      //converts to binary, but without the 8 bit left padding 0s
      var fullBinForChar = ""; // to be stored once binForChar is 8 bits
      if (binForChar.length <= 8){
        if (padding.length > binForChar.length){
          var howShort = padding.length - binForChar.length;
          for (var j = binForChar.length; j < 8; j++) {
            fullBinForChar = fullBinForChar + "0";
            }
          fullBinForChar = fullBinForChar + binForChar;
        } else {
          fullBinForChar = binForChar;
        }
    } else {
      fullBinForChar = "00111111";
    }
      message = message + fullBinForChar;
    }
}

function saveImages(){
  //saves the images to your computer
   imgfinal.save('imgfinal', 'png');
   imgbefore.save('imgbefore', 'png');
}
