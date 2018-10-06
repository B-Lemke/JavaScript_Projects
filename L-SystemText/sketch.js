/*Broderick Lemke, 2018 */

//Variables: A B
//Axiom: A
//Rules: (A > AB), (B > A)

var axiom = "A";
var sentence = axiom;

var rule = {
  a: "A",
  b: "AB"
}

var rule2 = {
  a: "B",
  b: "A"
}



function setup() {
  noCanvas();
  createP(axiom);
  var button = createButton("Generate");
  button.mousePressed(generate);
}



function generate(){
       var nextSentence = "";
   for (var i = 0; i < sentence.length; i++) {

     var current = sentence.charAt(i);
     if (current == rule.a){
       nextSentence += rule.b;

     }
     else if (current == rule2.a){
       nextSentence += rule2.b;
     }
     else {
       nextSentence += current;
     }
   }

   sentence = nextSentence;
   createP(sentence);

}

//
// function draw() {
//
// }
// //
