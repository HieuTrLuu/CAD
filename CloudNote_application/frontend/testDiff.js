var Diff = require('text-diff');
 
var diff = new Diff(); // options may be passed to constructor; see below
var textDiff = diff.main('text1 93', 'text2 43111'); // produces diff array
diff.prettyHtml(textDiff); // produces a formatted HTML string
console.log(textDiff);
console.log(diff.prettyHtml(textDiff));

