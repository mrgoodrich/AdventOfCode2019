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

for (let step = 0; step < 1000; step++) {
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
  // console.log(planets);
}

let energy = 0;
for (let planet of planets) {
  let pot = 0;
  let kin = 0;
  for (let axisNdx in planet.position) {
    pot += Math.abs(planet.position[axisNdx]);
    kin += Math.abs(planet.velocity[axisNdx]);
  }
  energy += pot * kin;
}

console.log(energy);



function clone(planets) {
  let clo = [];
  for (let planet of planets) {
    let curPos = planet.position;
    let curVelocity = planet.velocity;
    clo.push({position: curPos.slice(0), velocity: curVelocity.slice(0)});
  }
  return clo;
}



// ----------- GUESSES -------------------------
