// ----------- PACKAGES -----------------------
const fs = require('fs');
const {every, any, contains, enumerate, filter, flat, iter, map, partition, permutations, range, reduce, reduce_, sorted, sum, toArray, zip, zip3} = require('iter-tools');
const {max, min} = require('itertools');
// const Map = require('collections/map');
// const pycollections = require('pycollections');

// ----------- INPUT SETUP --------------------
const input = fs.readFileSync('inputs/input', 'utf8');

// ----------- TESTING AND REGEX -----®---------
const nonWhitespace = /\S+/g;
const positiveOrNegativeNumber = /(-?)(\d+)/g;
const numberAndWord = /(-?)(\d+) \S+/g;
const entireLine = /^(\<x\=)(\S*)(, y\=)(\S*)(, z\=)(\S*)(\>)/gm

const regex = entireLine;

// ----------- SOLUTION ------------------------

let planets = [];

let result;
while((result = regex.exec(input)) !== null) {
  const entireMatch = result[0]; // has new line char if entireLine
  const firstGroup = result[1];

  let x = parseInt(result[2]);
  let y = parseInt(result[4]);
  let z = parseInt(result[6]);
  planets.push({position: [x,y,z], velocity: [0,0,0]});
}



let original = clone(planets);

let steps = 1;

// let knownStates = new Set();

let prev = 0;

let repeat = {0: [], 1: [], 2: []};

function getKey(arr, axisNdx) {
  return curPos = arr[0].position[axisNdx] + ',' + arr[1].position[axisNdx] + ',' + arr[2].position[axisNdx] + ',' + arr[3].position[axisNdx] + ', ' +
  arr[0].velocity[axisNdx] + ',' + arr[1].velocity[axisNdx] + ',' + arr[2].velocity[axisNdx] + ',' + arr[3].velocity[axisNdx];;
}

for (let step = 0; step < 10000000; step++) {

  runGravity();

  for (let axisNdx in planets[0].position) {
    // let curPos = toArray(flat(1, [planets[0].position[axis], planets[1].position, planets[2].position]));
    if (getKey(planets, axisNdx) == getKey(original, axisNdx)) {
      // console.log(step - );
      // process.exit();
      console.log('found ' + getKey(planets, axisNdx));
      repeat[axisNdx].push(step + 1);
    } else {
      // knownStates.add(curPos);
      // console.log(knownStates);
    }
  }

  if (Object.keys(repeat).length == 3 && repeat[0].length > 5 &&  repeat[1].length > 5 &&  repeat[2].length > 5) {
    console.log(repeat);
    let vals = Object.values(repeat).map(a => a[0]);
    console.log(reduce(1, lcm, vals));
    process.exit();
  }

  // for (let planetNdx in planets) {
    // if (JSON.stringify(planets[1].position[1]) == JSON.stringify(original[1].position[1])) {
      // console.log(step - prev);
      // prev = step;
    //   console.log(`planet ${1} position at step ${step}`);
    // }
    // if (JSON.stringify(planets[planetNdx].velocity) == JSON.stringify(original[planetNdx].velocity)) {
    //   console.log(`planet ${planetNdx} velocity at step ${step}`);
    // }
  // }
}

function gcd(a, b) {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}

function lcm(n1, n2) {
  let gcdv = gcd(n1, n2);

  return (n1 * n2) / gcdv;
}

function runGravity() {
  let before = clone(planets);

  // Update velocity
  for (let planetNdx in before) {
    const planet = before[planetNdx];
    for (let otherNdx in before) {
      const other = before[otherNdx];
      if (planetNdx != otherNdx) {
        for (let axisNdx in planet.position) {
          let diff = planet.position[axisNdx] - other.position[axisNdx];
          if (diff < 0) {
            planets[planetNdx].velocity[axisNdx]++;
          } else if (diff > 0) {
            planets[planetNdx].velocity[axisNdx]--;
          }
        }
      }
    }
  }

  // Apply velocities
  for (let planet of planets) {
    for (let axisNdx in planet.position) {
      planet.position[axisNdx] += planet.velocity[axisNdx];
    }
  }
}



function clone(planets) {
  let clo = [];
  for (let planet of planets) {
    let curPos = planet.position;
    let curVelocity = planet.velocity;
    clo.push({position: curPos.slice(0), velocity: curVelocity.slice(0)});
  }
  return clo;
}




// while (true) {
//   let before = clone(planets);
//
//   // assuming the velocity continually increases in the direction toward the nearest
//   // and moves in that direction, how many frames it would take to pass
//   let minDiff;
//
//   for (let planetNdx in before) {
//     const planet = before[planetNdx];
//
//     for (let axisNdx in planet.position) {
//       let netPosDiff = 0;
//
//
//
//       for (let otherNdx in before) {
//         const other = before[otherNdx];
//         if (planetNdx != otherNdx) {
//           let posDiff = planet.position[axisNdx] - other.position[axisNdx];
//           let curVel = planet.velocity[axisNdx];
//             // assuming 10 vel start and dist 100
//             // want 10 + 11 + 12 + 13 + ...
//             // vel + (vel + 1) + (vel + 2) + (vel + n) < posDiff;
//             // ((n - 1) * vel) + n(n+1)/2 < posDiff
//
//             let diff = findMaxDiffSteps(posDiff, curVel);
//             if (!minDiff || diff < minDiff) {
//               minDiff = diff;
//             }
//           }
//         }
//       }
//     }
//   }
//
//   console.log('would step ' + minDiff);
//   process.exit();
//
//   applyGravityScaled(minDiff);
//
//   if (min([before[0].position[0], planets[0].position[0]]) <= original[0].position[0]
//       && max([before[0].position[0], planets[0].position[0]]) <= original[0].position[0]) {
//     console.log('rewind and check');
//   }
//
//   steps += minDiff;
//   // console.log(planets);
// }
//
// // Could optimize by then stepping backward until less than again, then greater until greater, etc.. until exactly 1 less
// function findMaxDiffSteps(posDiff, curVel, dir) {
//   let largestLessThan = 0;
//   let knownGreaterThan;
//   // multiply by 10 until greater than posDiff
//   let curTest = 1;
//   while (!knownGreaterThan) {
//     let res = getDiff(curTest, curVel);
//     console.log(res);
//     if (res > posDiff) {
//       return largestLessThan;
//     } else if (res == posDiff) {
//       return curTest;
//     }
//     largestLessThan = curTest;
//     curTest *= 2;
//   }
// }
//
// function getDiff(frames, curVel) {
//   // ((n - 1) * vel) + n(n+1)/2 < posDiff
//   return ((frames - 1) * curVel) + (frames * (curVel + 1) / 2);
// }
//
//
// function applyGravityScaled(scale) {
//   console.log('scaled: ' + scale);
//   // Update velocity
//   for (let planetNdx in before) {
//     const planet = before[planetNdx];
//     for (let axisNdx in planet.position) {
//       let diff = planet.position[axisNdx] - other.position[axisNdx];
//       if (diff < 0) {
//         planets[planetNdx].velocity[axisNdx]++;
//       } else if (diff > 0) {
//         planets[planetNdx].velocity[axisNdx]--;
//       }
//     }
//   }
//
//   // Apply velocities
//   for (let planet of planets) {
//     for (let axisNdx in planet.position) {
//       planet.position[axisNdx] += planet.velocity[axisNdx];
//     }
//   }
// }
//
// function clone(planets) {
//   let clo = [];
//   for (let planet of planets) {
//     let curPos = planet.position;
//     let curVelocity = planet.velocity;
//     clo.push({position: curPos.slice(0), velocity: curVelocity.slice(0)});
//   }
//   return clo;
// }
//
// function applyGravOrig() {
//   let before = clone(planets);
//
//   // Update velocity
//   for (let planetNdx in before) {
//     const planet = before[planetNdx];
//     for (let otherNdx in before) {
//       const other = before[otherNdx];
//       if (planetNdx != otherNdx) {
//         for (let axisNdx in planet.position) {
//           let diff = planet.position[axisNdx] - other.position[axisNdx];
//           if (diff < 0) {
//             planets[planetNdx].velocity[axisNdx]++;
//           } else if (diff > 0) {
//             planets[planetNdx].velocity[axisNdx]--;
//           }
//         }
//       }
//     }
//   }
//
//   // Apply velocities
//   for (let planet of planets) {
//     for (let axisNdx in planet.position) {
//       planet.position[axisNdx] += planet.velocity[axisNdx];
//     }
//   }
// }
//
//
// // ----------- GUESSES -------------------------
