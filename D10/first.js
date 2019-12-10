// ----------- PACKAGES -----------------------
const fs = require('fs');
const {all, any, contains, enumerate, filter, iter, map, partition, permutations, range, reduce, reduce_, sorted, sum, toArray, zip, zip3} = require('iter-tools');
const {max, min} = require('itertools');
// const Map = require('collections/map');
// const pycollections = require('pycollections');

// ----------- INPUT SETUP --------------------
const input = fs.readFileSync('inputs/input', 'utf8');

// ----------- TESTING AND REGEX -----®---------
const nonWhitespace = /\S+/g;
const positiveOrNegativeNumber = /(-?)(\d+)/g;
const numberAndWord = /(-?)(\d+) \S+/g;
const entireLine = /^(\S*)(?:\n)/gm

const regex = entireLine;

// ----------- SOLUTION ------------------------

let asteroids = [];
let astMap = {};

let y = 0;
let result;
while((result = regex.exec(input)) !== null) {
  const entireMatch = result[0]; // has new line char if entireLine
  const firstGroup = result[1];

  let x = 0;
  for (const char of firstGroup) {
    if (char == '#') {
      asteroids.push([x, y]);
      astMap[[x,y]] = 1;
    }
    x++;
  }
  y++;
}

function greatestCommonDivisor(a, b) {
  if (!b) {
    return a;
  }

  return greatestCommonDivisor(b, a % b);
}

function checkClosePrecision(x, y) {
  const precision = .0000001;
  const closeX = Math.abs(x - Math.round(x)) < precision ? Math.round(x) : x;
  // console.log(Math.abs(x - Math.round(x)));
  const closeY = Math.abs(y - Math.round(y)) < precision ? Math.round(y) : y;
  // console.log('in ' + [x,y] + ' out ' + [closeX, closeY]);
  return astMap[[x, y]];
}

function getNumVisible([astX, astY]) {
  let invisible = [];
  let visible = [];
 // console.log('*looking at ast at ' + astX +', ' + astY)
  let numVis = 0;
  for (let [curX, curY] of asteroids) {
   // console.log(' ---- comparing ' + curX + ', ' + curY);
    let dq = false;
    if (curX == astX && curY == astY) {
      dq = true;
    }

    let smallerX = min([astX, curX]);
    let largerX = max([astX, curX]);

    let smallerY = min([astY, curY]);
    let largerY = max([astY, curY]);

    let xDiff = largerX - smallerX;
    let yDiff = largerY - smallerY;
//    // console.log('xdiff ' + xDiff + ' and ydiff ' + yDiff);

    let gcd = greatestCommonDivisor(xDiff, yDiff);

    let xRat = xDiff / yDiff;
    let yRat = yDiff / xDiff;

//    // console.log('xrat ' + xRat);



    let x, y;



//    // console.log(curX + ', ' + curY);
//    // console.log(astX + ', ' + astY);

    let incTogether = ((curX < astX && curY < astY) || (astX < curX && astY < curY));

    if (yDiff === 0) {
      x = smallerX;
      y = (smallerX == curX) ? curY : astY;
      x++;

//      console.log('nanx')
      while (x < largerX) {
//        console.log('checking ' + x + ', ' + y)
        if (astMap[[x,y]]) {
         // console.log('nan disq x');
          dq = true;
        }
        x++;
      }
    } else if (xDiff === 0) {
      y = smallerY;
      x = (smallerY == curY) ? curX : astX;
      y++;

//      console.log('nany')
      while (y < largerY) {
       // console.log('checking ' + x + ', ' + y)
        if (astMap[[x,y]]) {
         // console.log('nan disq y');
          dq = true;
        }
        y++;
      }
    } else if (incTogether) {
     // console.log('inc together');
      // Start at the top left of the two
      y = smallerY;
      x = smallerY == curY ? curX : astX;

      // try moving multiple x per one Y. GOOD
      if (Math.abs(xRat) >= 1) {
        while (y < largerY - 1) {
          // console.log('adding ' + xRat);
          x += xDiff / gcd;
          y += yDiff / gcd;
          // console.log('checking ' + x + ', ' + y)
          if (y < largerY && checkClosePrecision(x,y)) {
            dq = true;
          }
        }
      }

      // start at top left of two
      y = smallerY;
      x = smallerY == curY ? curX : astX;

      // try moving multiple y per one X.
      if (Math.abs(yRat) >= 1) {
        while (x < largerX - 1) {
          x += xDiff / gcd;
          y += yDiff / gcd;
          if (x < largerX && checkClosePrecision(x,y)) {
            dq = true;
          }
        }
      }
    } else { // Inc opposite
     // console.log('inc opposite');
      // Start at the top right of the two
      y = smallerY;
      x = smallerY == curY ? curX : astX;

      // try moving multiple x per one Y. GOOD
      if (Math.abs(xRat) >= 1) {
        while (y < largerY - 1) {
          x -= xDiff / gcd;
          y += yDiff / gcd;
          // console.log('checking ' + x + ', ' + y)
          if (y < largerY && checkClosePrecision(x,y)) {
            dq = true;
          }
        }
      }

      y = smallerY;
      x = smallerY == curY ? curX : astX;

      // try moving multiple y per one X.
      if (Math.abs(yRat) >= 1) {
        while (x > smallerX + 1) {
          x -= xDiff / gcd;
          y += yDiff / gcd;
          if (x > smallerX && checkClosePrecision(x,y)) {
            dq = true;
          }
        }
      }
    }

    if (!dq) {
      visible.push([curX, curY]);
      numVis++;
      // console.log('visible');
    } else {
      invisible.push([curX, curY]);
      // console.log('invisible')
    }
  }
  // console.log(visible.filter(a => a[0] ==5));
  return numVis;
}

let curMax = 0;
let maxSpot;
for (let ast of asteroids) {
  let num = getNumVisible(ast);
  if (num > curMax) {
    curMax = num;
    maxSpot = ast;
  }
}
console.log(maxSpot)
console.log(curMax);

// console.log(getNumVisible([1, 0]))










// ----------- GUESSES -------------------------

280
276
