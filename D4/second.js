// ----------- PACKAGES -----------------------
const fs = require('fs');
const {all, any, contains, enumerate, filter, iter, map, range, reduce, reduce_, sorted, sum, zip, zip3} = require('itertools');
// const Map = require('collections/map');
const pycollections = require('pycollections');

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

// for (const match of matches) {
//   console.log(match[0]);
//
// }

const min = 172851;
const max = 675869

// const counter = new pycollections.Counter();
let num = 0;
const matched = [];
for (let test = min; test < max; test++) {
  test = test + '';
  if ((test + '').length != 6) {
    continue;
  }
  // console.log(test[0]);
  if (!((test[0] === test[1]) || (test[1] === test[2]) || (test[2] === test[3]) || (test[3] === test[4]) || (test[4] === test[5]))) {
    continue;
  }

  let matchCount = 0;

  let p = test[0];
  // for (let n = 0; n < 5; n++) {
  //   p = test[n];
  //   if (n)
  // }

  counter = new pycollections.Counter(test.split(''));
  if (!contains(counter.values(), 2)) {
    continue;
  }

  // if ((test[0] === test[1] && test [1] === test[2])
  // || (test[1] === test[2] && test [2] === test[3])
  // || (test[2] === test[3] && test [3] === test[4])
  // || (test[3] === test[4] && test [4] === test[5])) {
  //   continue;
  // }

  let prev = test[0]
  let dec = true;
  for (let ndx = 0; ndx < 6; ndx++) {
    prev = parseInt(test[ndx]);
    // console.log(prev);
    if (parseInt(test[ndx+1])< prev) {
      dec = false;
    }

  }
  if (!dec) {
    continue;
  }
  // // console.log(test);
  // // num++;
  // // matched.push(test);
  // counter.update([test]);
  if (!contains(matched, parseInt(test))) {
    matched.push(parseInt(test));
  }
}
console.log(matched.length);


// ----------- GUESSES -------------------------
// 935