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

const baseX = 17;
const baseY = 22;

let reducedToPointWithDist = {};

for (let [curX, curY] of asteroids) {
  // console.log('cur point ' + curX + ', ' + curY)
  if (curX == baseX && curY == baseY) {
    continue;
  }

  let xDiff = curX - baseX;
  let yDiff = curY - baseY;
  // console.log('x diff: ' + xDiff);
  // console.log('y diff: ' + yDiff);

  let gcd = greatestCommonDivisor(Math.abs(xDiff), Math.abs(yDiff));
  // console.log('gcd abs: ' + gcd)
  let key = [xDiff / gcd, yDiff / gcd];
  // console.log('key: ' + key);
  if (!reducedToPointWithDist[key]) {
    reducedToPointWithDist[key] = [];
  }
  reducedToPointWithDist[key].push({point: [curX, curY], dist: Math.abs(xDiff) + Math.abs(yDiff)});
}

let reducedKeys = Object.keys(reducedToPointWithDist);
// console.log(reducedKeys);

reducedKeys.sort((a, b) => {
  // console.log('a: ' + a);
  // console.log('b: ' + b);
  const angleA = Math.atan2(a.split(',')[0], a.split(',')[1]);
  const angleB = Math.atan2(b.split(',')[0], b.split(',')[1]);
  // console.log('angle a: ' + angleA);
  // console.log('angle b: ' + angleB);
  if (angleA < angleB) {
    return -1;
  }
  if (angleB < angleA) {
    return 1;
  }
  return 0;
}).reverse();
// console.log(reducedKeys);

for (const key of reducedKeys) {
  const before = reducedToPointWithDist[key];
  const after = before.sort((a, b) => a.dist < b.dist ? -1 : (b.dist < a.dist ? 1 : 0));
  reducedKeys[key] = after;
}

// console.log(reducedToPointWithDist);

let curKeyNdx = 0;

let destroyedCount = 0;
while (destroyedCount < 200) {
  const pointWithDist = reducedToPointWithDist[reducedKeys[curKeyNdx]];
  if (pointWithDist.length) {
    // console.log('key: ' + reducedKeys[curKeyNdx]);
    // console.log(pointWithDist);
    let vaporized = pointWithDist[0];
    reducedToPointWithDist[reducedKeys[curKeyNdx]] = pointWithDist.splice(1);
    if (destroyedCount == 199) {
      console.log(`Asteroid #${destroyedCount + 1} vaporized is at ${vaporized.point}`);
      console.log(`Answer: ` + (vaporized.point[0] * 100 + vaporized.point[1]))
    }
    destroyedCount++;
  }

  curKeyNdx++;
  curKeyNdx %= reducedKeys.length;
}


// ----------- GUESSES -------------------------
