// ----------- PACKAGES -----------------------
const fs = require('fs');

// ----------- INPUT SETUP --------------------
const input = fs.readFileSync('inputs/input', 'utf8');

// ----------- TESTING AND REGEX -----®---------
const isTest = false;

// ----------- SOLUTION ------------------------

// !!!!! USE D2.second.js if reusing Intcode computer.

const data = input.split(',');
for (let ndx = 0; ndx < data.length; ndx++) {
  data[ndx] = parseInt(data[ndx]);
}

function runProgram() {
  for (let ndx = 0; ndx < data.length; ndx += 4) {
    const opcode = data[ndx];
    const p1 = data[ndx + 1];
    const p2 = data[ndx + 2];
    const p3 = data[ndx + 3];

    switch(opcode) {
      case 1:
        data[p3] = data[p1] + data[p2];
        break;
      case 2:
        data[p3] = data[p1] * data[p2];
        break;
      case 99:
        return;
    }
  }
}
runProgram();

console.log(data[0]);

// ----------- GUESSES --------------------------
