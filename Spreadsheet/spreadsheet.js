var numRows = 10;
var numCols = 10;

var rowText;
var rowClose = "</div>";

var rowLetter;

var settingUp = true;


//Context Menu variables
var menu;
var menuState = 0;
var active = "contextMenuActive";

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

  contextMenuPrep();

  //after set up, set the context menu into a variable
  menu = document.querySelector(".contextMenu");
});





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Converting letters and numbers

function numToString(num){
  //From https://stackoverflow.com/questions/11089399/count-with-a-b-c-d-instead-of-0-1-2-3-with-javascript
  "use strict";
  var mod = num % 26;
  var pow = num / 26 | 0;
  var out = mod ? String.fromCharCode(64 + mod) : (pow--, 'Z');
  return pow ? numToString(pow) + out : out;
}

function stringToNum(str) {
    "use strict";
    var out = 0, len = str.length, pos = len;
    while (--pos > -1) {
        out += (str.charCodeAt(pos) - 64) * Math.pow(26, len - 1 - pos);
    }
    return out;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Adding Columns and rows

function addRowToBottom(){
  var curRowNum =  $('#spreadsheetContainer .row').length;
  var curColNum =  $('#spreadsheetContainer .row:first .col').length;
  console.log(curRowNum);

    //start a row
  $("#spreadsheetContainer").append('<div class="row" id="' + (curRowNum) + '">');
  //the Left column with the numberKey inside the new row
  $(".row#"+(curRowNum)).append('<div class="numberKey">' + (curRowNum) + '</div>');

  for (var j = 0; j < curColNum; j++){
    //add columns/cells to the row
    var rowLetter = numToString(j+1);
    if(settingUp){
      $(".row#"+(curRowNum)).append('<input class="col" id="' + rowLetter + '">');
    } else{
      //add animation if after the setup
      $(".row#"+(curRowNum)).hide().append('<input class="col" id="' + rowLetter + '">').slideDown(100);
    }
  }
  //scroll to bottom
  $("body").animate({scrollTop: $("#spreadsheetContainer").prop("scrollHeight")}, 100);
}


function addColToEnd(){
  //find the number of columns
  var curColNum =  $('#spreadsheetContainer .row:first .col').length + 1;

  //get next letter
  var rowLetter = numToString(curColNum);

  //add the key letter
  $("#key").append('<div class="col" id="' + rowLetter + '" > ' + rowLetter + ' </div>');

  //add column to every row except for the first
  $(".row:not(:first)").append('<input class="col" id="' + rowLetter + '">').slideDown(1000);;

  var leftPos = $('body').scrollLeft()
  $("body").animate({scrollLeft: leftPos + 400}, 800);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Context menu
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function contextMenuPrep() {
  //based on this https://www.sitepoint.com/building-custom-right-click-context-menu-javascript/

  "use strict";

  //create an array of all the columns in the key row and rows with a numberKey
  var columns = $("#key .col");
  var rows = $(".row .numberKey");

  //loop through the columns and add event listeners
  for ( var i = 0, len = columns.length; i < len; i++ ) {
    var column = columns[i];
    contextMenuListener(column);
  }

  //loop through the rows and add even listeners
  for ( var i = 0, len = rows.length; i < len; i++ ) {
    var row = rows[i];
    contextMenuListener(row);
  }

  //add even listener to the document to close context menu
  document.addEventListener( "click", function(e) {
    //click anywhere to close the context menu
    toggleMenuOff();
  });

}

  //function to add event listeners
function contextMenuListener(el) {
    el.addEventListener( "contextmenu", function(e) {
    e.preventDefault();
    toggleMenuOn();
    });
}

//Turn the menu on, set it's display to block using a new class
function toggleMenuOn() {
    if ( menuState !== 1 ) {
      menuState = 1;
      menu.classList.add(active);
    }
  }

//turn the menu off, remove the active class
function toggleMenuOff() {
    if ( menuState == 1 ) {
      menuState = 0;
      menu.classList.remove(active);
    }
  }

  function contextListener(){

  }

  function clickListener(){

  }

  function keyUpListener(){


  }
