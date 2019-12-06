// ----------- PACKAGES -----------------------
const fs = require('fs');
const {all, any, contains, enumerate, filter, iter, map, max, min, range, reduce, reduce_, sorted, sum, zip, zip3} = require('itertools');
// const Map = require('collections/map');
// const pycollections = require('pycollections');

// ----------- INPUT SETUP --------------------
const input = fs.readFileSync('inputs/input', 'utf8');

// ----------- TESTING AND REGEX -----®---------
const nonWhitespace = /\S+/g;
const positiveOrNegativeNumber = /(-?)(\d+)/g;
const numberAndWord = /(-?)(\d+) \S+/g;

const regex = /^(\S*)\)(\S*)$/gm;
const matches = input.matchAll(new RegExp(regex));

// ----------- SOLUTION ------------------------
// match[0]: entire match
// match[1..N]: group

const nodes = new Map();

for (const match of matches) {
  // console.log(match[0]);

  const parent = match[1];
  const child = match[2];

  if (!nodes.has(parent)) {
    nodes.set(parent, []);
  }

  nodes.get(parent).push(child);
}

// console.log(nodes);

let root;
for (const node of nodes.entries()) {
  const parent = node[0];
  const children = node[1];

  let found = false;
  for (const search of nodes.entries()) {
    if (contains(search[1], parent)) {
      // console.log('found ' + parent + ' in ' + search[1])
      found = true;
    }
  }
  if (!found) {
    // console.log('root: ' + parent);
    root = parent;
  }
}

let curAnc = 'YOU';
let youAnc = new Set();
youAnc.add(curAnc);
while (getParent(curAnc)) {
  curAnc = getParent(curAnc);
  youAnc.add(curAnc);
  console.log('adding ' + curAnc);
}

console.log(youAnc);



let sanCur = 'SAN';
let sanAnc = [sanCur];
while (getParent(sanCur)) {
  sanCur = getParent(sanCur);
  sanAnc.push(sanCur);
  console.log('adding ' + sanCur);
}

console.log(sanAnc);

let lowestAnc;
while(!lowestAnc) {
  console.log('checking ' + youAnc + ' for ' + sanAnc[0]);
  if (youAnc.has(sanAnc[0])) {
    lowestAnc = sanAnc[0];
  }
  sanAnc.splice(0,1);
}

let transfers = 0;

let curr = 'YOU';
while(getParent(curr) !== lowestAnc) {
  transfers++;
  curr = getParent(curr);
  console.log('cur now ' + curr);
}
curr = 'SAN';
while(getParent(curr) !== lowestAnc) {
  transfers++;
  curr = getParent(curr);
}
console.log(transfers);


function getParent(sym) {
  for (const node of nodes.entries()) {
    if (contains(node[1], sym)) {
      return node[0];
    }
  }
  return false;
}

// console.log(nodes);




// ----------- GUESSES -------------------------
