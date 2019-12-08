// ----------- PACKAGES -----------------------
const fs = require('fs');
// const {all, any, contains, enumerate, filter, iter, map, max, min, range, reduce, reduce_, sorted, sum, zip, zip3} = require('itertools');
// const Map = require('collections/map');
const pycollections = require('pycollections');

// ----------- INPUT SETUP --------------------
const input = fs.readFileSync('inputs/input', 'utf8');

let width = 25;
let height = 6;

let realinput = input.split('\n')[0];
const layers = [];
while (realinput.length) {
  layers.push(realinput.substring(0, width * height));
  realinput = realinput.substring(width * height);
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

// const c2 = new pycollections.Counter(minLayer.split(''));
// console.log(c2.get('1') * c2.get('2'));

let pixels = [];

for (let pixelNdx = 0; pixelNdx < width * height; pixelNdx++) {
  let curVal = '2';
  for (let layer of layers) {
    let cur = layer[pixelNdx];

    if (curVal == '2') {
      curVal = cur;
    }
  }
  if (curVal == '0') {
    curVal = '_';
  }
  pixels.push(curVal);
}

pixels = pixels.join('');

let image = [];
for (let col = 0; col < width; col++) {
  image.push(pixels.substring(0, width));
  console.log(pixels.substring(0, width));
  pixels = pixels.substring(width);

}
// console.log(pixels);


// ----------- GUESSES -------------------------
