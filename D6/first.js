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

console.log(nodes);

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
    console.log('root: ' + parent);
    root = parent;
  }
}

let todo = [[root, 0]];
let orbits = 0;

while (todo.length) {
  const cur = todo[0];
  const curSymbol = cur[0];
  const depth = cur[1];
  const children = nodes.get(curSymbol);
  if (children) {
    todo = todo.concat(map(children, child => [child, depth + 1]) );
  }
  console.log('adding depth ' + depth + ' for ' + curSymbol)
  orbits += depth;
  todo.splice(0, 1);
}
console.log(orbits);

// console.log(nodes);




// ----------- GUESSES -------------------------
