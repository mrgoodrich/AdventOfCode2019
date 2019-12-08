// ----------- PACKAGES -----------------------
const fs = require('fs');
// const {all, any, contains, enumerate, filter, iter, map, max, min, range, reduce, reduce_, sorted, sum, zip, zip3} = require('itertools');
// const Map = require('collections/map');
const pycollections = require('pycollections');

// ----------- INPUT SETUP --------------------
const input = fs.readFileSync('inputs/input', 'utf8');

let realinput = input.split('\n')[0];
const layers = [];
while (realinput.length) {
  layers.push(realinput.substring(0, 25 * 6));
  realinput = realinput.substring(25 * 6);
}
// console.log(layers);

let minLayer;
let minLayerCount = 1000;

for (let row of layers) {
  const counter = new pycollections.Counter(row.split('')); // ...Counter('abc'.split('a')); the split is making the string into array
  const count = counter.get('0');
  if (count < minLayerCount) {
    minLayerCount = count;
    minLayer = row;
  }
}
// console.log(layers.length);
// console.log(minLayer);

const c2 = new pycollections.Counter(minLayer.split(''));
console.log(c2.get('1') * c2.get('2'));






// ----------- GUESSES -------------------------
