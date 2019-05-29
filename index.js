const express = require('express');
const app = express();
const colors = require('colors');
var targetBaseUrl = process.env.REDIRECT_URL;
var pdfreader = require('pdfreader');

// const targetBaseUrl = 'https://dev.creditculture.sg';



// let fs = require('fs'),
//         PDFParser = require("pdf2json");

//     let pdfParser = new PDFParser();

//     pdfParser.loadPDF("CBSReport.pdf");
//     pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
//     pdfParser.on("pdfParser_dataReady", pdfData => {
//         fs.writeFile("CBSReport.json", JSON.stringify(pdfData));
//     });
// stopWords =['DataProvided','']



searchStrings = [
  { searchStr: 'EnquiryNumber', algo: 'getnumber' },
  { searchStr: 'Print Friendly',algo: 'getpostdate'},
  { searchStr: 'EnquiryDate',algo: 'getenquirydate'},
  { searchStr: 'EnquiryDate',algo: 'stopword'},

]
var text = '';
var fs = require("fs");
fs.readFile("CBSReport.pdf", (err, pdfBuffer) => {
  // pdfBuffer contains the file content

  // new pdfreader.PdfReader().parseBuffer(pdfBuffer, function(err, item){
  new pdfreader.PdfReader().parseBuffer(pdfBuffer, function (err, item) {


    if (err) {
      // callback(err);
      console.log("error");
    }
    else if (!item) {
      // callback();
      console.log("error");
      console.log(text);
      //normalize
      console.log("normalize String");
      // text=text.replace(/([A-Z])\s(?=[A-Z])/g, '$1');
      text = text.replace(/([A-Z])\s/g, '$1');
      console.log(text);
      // allOccurences(text, 'Print Friendly');
      allOccurences(text, 'EnquiryNumber');
      DisplayData(text)

    }
    else if (item.text)
      text = text + item.text
    // console.log(text);
  });
  // console.log (text);
});

function DisplayData(text) {

  searchStrings.forEach(element => {
    console.log("element",element);
  
  var taglength = element.searchStr.length;
  console.log(element.searchStr);
  var n = text.search(element.searchStr);
  var len = 0;
 
  if (element.algo == 'getnumber') {
    while (isDigit(text[n + taglength + len])) {
      len++;
    }
    console.log(text.substr(n + taglength, len));
  }
  else if (element.algo == 'getenquirydate') {
    while (isDate(text[n + taglength + len])) {
      len++;
    }

    console.log(text.substr(n + taglength, len));

  }
  // var n1 = text.lastIndexOf(element.searchStr);
  // console.log(n1);

});
}

function isDigit(aChar) {
  myCharCode = aChar.charCodeAt(0);

  if ((myCharCode > 47) && (myCharCode < 58)) {
    return true;
  }

  return false;
}

function isDate(aChar) {
  // console.log ( "charCode:",aChar);
  myCharCode = aChar.charCodeAt(0);
  // console.log ( "charCode:",myCharCode);
  if ((myCharCode > 47) && (myCharCode < 58) || aChar=='/' || aChar=='-') {
    return true;
  }

  return false;
}

// function upper_case(str) {
//   regexp = /^[A-Z]/;
//   if (regexp.test(str)) {
//     console.log("String's first character is uppercase");
//   }
//   else {
//     console.log("String's first character is not uppercase");
//   }
// }

function normalizeString(text) {
  // .replace(/\s/g, '')
  text.replace(replace(/([A-Z])\s(?=[A-Z])/g, '$1'))
}

function allOccurences(text, needle) {
  var re = new RegExp(needle, 'gi');
  var results = new Array();//this is the results you want
  while (re.exec(text)) {
    // results.push(re.lastIndex);
    console.log("index:",re.lastIndex);
  }
}