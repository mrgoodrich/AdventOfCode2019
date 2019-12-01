// ----------- PACKAGES -----------------------
const fs = require('fs');
const {all, any, contains, enumerate, filter, iter, map, max, min, range, reduce, reduce_, sorted, sum, zip, zip3} = require('itertools');
const Map = require('collections/map');

// ----------- INPUT SETUP --------------------
const input = fs.readFileSync('inputs/input', 'utf8');

// ----------- TESTING AND REGEX -----®---------
const isTest = false;

const nonWhitespace = /\S+/g;
const positiveOrNegativeNumber = /(-?)(\d+)/g;
const numberAndWord = /(-?)(\d+) \S+/g;
const entireLine = /^.*$/gm

const regex = entireLine;
const matches = input.matchAll(new RegExp(regex));

// ----------- SOLUTION ------------------------
// match[0]: entire match
// match[1..N]: group

function fuel(i) {
  let part = Math.floor(parseInt(i)/3) - 2;
    console.log('s:' +  part)
  if (part <= 0) {
    return 0;
  }

  return part + fuel(part);
}
let s = 0;
for (const match of matches) {
  s += fuel(match[0]);
}
console.log(s);


// ----------- GUESSES -------------------------
