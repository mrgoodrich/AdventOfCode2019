// ----------- PACKAGES -----------------------
const fs = require('fs');
const {all, any, contains, enumerate, filter, iter, map, max, min, range, reduce, reduce_, sorted, sum, zip, zip3} = require('itertools');
// const Map = require('collections/map');
// const pycollections = require('pycollections');

// ----------- INPUT SETUP --------------------
const input = fs.readFileSync('inputs/input', 'utf8');

// ----------- TESTING AND REGEX -----®---------
const isTest = false;

const nonWhitespace = /\S+/g;
const positiveOrNegativeNumber = /(-?)(\d+)/g;
const numberAndWord = /(-?)(\d+) \S+/g;
const entireLine = /^.*$/gm

const regex = /^(([R|D|L|U])(\d+)(\,)*)*$/gm;
const matches = input.matchAll(new RegExp(regex));

// ----------- SOLUTION ------------------------
// match[0]: entire match
// match[1..N]: group

// let grid = [];


// const size = 500;
// for (let y = 0; y < size; y++) {
//   let row = [];
//   for (let x = 0; x < size; x++) {
//     row.push(0);
//   }
//   grid.push(row);
// }

const reached = {};

const matchesBackup = input.matchAll(new RegExp(regex));

let spots = [];

let intersections = {};

function mark() {
  // console.log('marking ' + x + ', ' + y);
  if (reached[y] && reached[y][x] && !reached[y][x][lineNdx]) {
    // console.log('crossed at ' + x + ', ' + y);

    spots.push(Math.abs(x) + Math.abs(y));
    if (!intersections[y]) {
      intersections[y] = {};
    }
    intersections[y][x] = 1;
  }
  if (!reached[y]) {
    reached[y] = {};
  }
  if (!reached[y][x]) {
    reached[y][x] = {};
  }

  reached[y][x][lineNdx] = 1;

}

let lineNdx = 0;
var x,y;
for (const match of matches) {
  lineNdx++;
  x = 0, y = 0;

  let moves = match[0].split(',');
  for (let move of moves) {
    // console.log(move);
    const dist = move.slice(1);
    switch (move[0]) {

      case 'U':
        for (let i = 0; i < dist; i++) {
          y--;
          mark();
        }
        break;
      case 'L':
        for (let i = 0; i < dist; i++) {
          x--;
          mark();
        }
        break;
      case 'R':
        for (let i = 0; i < dist; i++) {
          x++;
          mark();
        }
        break;
      case 'D':
        for (let i = 0; i < dist; i++) {
          y++;
          mark();
        }
        break;
    }
  }

}
let steps;
let curMinSteps = 10000000;
let curMinX = 0;
let curMinY = 0;

const mins = new Map();

function mark2() {
  steps++;
  if (intersections[y] && intersections[y][x]) {
    if (!mins.has(x + ',' + y)) {
      mins.set(x + ',' + y, 0);
    }
    mins.set(x + ',' + y, mins.get(x + ',' + y) + steps);
  }
}

for (const match of matchesBackup) {
  lineNdx++;
  x = 0, y = 0;

  steps = 0;
  let moves = match[0].split(',');
  for (let move of moves) {
    const dist = move.slice(1);
    switch (move[0]) {

      case 'U':
        for (let i = 0; i < dist; i++) {
          y--;
          mark2();
        }
        break;
      case 'L':
        for (let i = 0; i < dist; i++) {
          x--;
          mark2();
        }
        break;
      case 'R':
        for (let i = 0; i < dist; i++) {
          x++;
          mark2();
        }
        break;
      case 'D':
        for (let i = 0; i < dist; i++) {
          y++;
          mark2();
        }
        break;
    }
  }

}
console.log(min(mins.values())) ;


// console.log(spots);
// console.log(grid);


// ----------- GUESSES -------------------------
