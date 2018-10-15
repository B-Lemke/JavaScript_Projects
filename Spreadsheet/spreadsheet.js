var numRows = 10;
var numCols = 10;

var rowText;
var rowClose = "</div>";

var rowLetter;

var settingUp = true;

//wait until document is loaded to do jquery
$(document).ready(function(){
  //Set-up the document


  //setup first row
  $("#spreadsheetContainer").append('<div class="row" id="key"></div>');
  //put in the first cell that goes over the row numbers
  $("#key").append('<div class="numberKey">SHEET</div>');

  //create the headers for the columns
  for (var i = 0; i < numCols; i++){
    //convert current position to a number
    var rowLetter = numToString(i+1);
    $("#key").append('<div class="col" id="' + rowLetter + '" > ' + rowLetter + ' </div>');

  }

  for (var i = 0; i < numRows; i++){
    addRowToBottom();
  }

  //turn of setting up for animations when rows are added
  settingUp = false;
});







function numToString(num){
  //From https://stackoverflow.com/questions/11089399/count-with-a-b-c-d-instead-of-0-1-2-3-with-javascript
  "use strict";
  var mod = num % 26;
  var pow = num / 26 | 0;
  var out = mod ? String.fromCharCode(64 + mod) : (pow--, 'Z');
  return pow ? numToString(pow) + out : out;
}


function addRowToBottom(){
  var curRowNum =  $('#spreadsheetContainer .row').length;
  console.log(curRowNum);

    //start a row
  $("#spreadsheetContainer").append('<div class="row" id="' + (curRowNum) + '">');
  //the Left column with the numberKey inside the new row
  $(".row#"+(curRowNum)).append('<div class="numberKey">' + (curRowNum) + '</div>');

  for (var j = 0; j < numCols; j++){
    //add columns/cells to the row
    var rowLetter = numToString(j+1);
    if(settingUp){
      $(".row#"+(curRowNum)).append('<input class="col" id="' + rowLetter + '">');
    } else{
      //add animation if after the setup
      $(".row#"+(curRowNum)).hide().append('<input class="col" id="' + rowLetter + '">').slideDown(250);
    }
  }
}
