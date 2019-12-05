// ----------- PACKAGES -----------------------
const fs = require('fs');

// ----------- INPUT SETUP --------------------
let input = fs.readFileSync('inputs/input', 'utf8');
var Map = require("collections/map");

// ----------- TESTING AND REGEX -----®---------
const isTest = false;

// ----------- SOLUTION ------------------------

let io = 1;

function getValue(mode, value) {
  return mode ? value : memory[value];
}

const INSTRUCTIONS = new Map();
INSTRUCTIONS.set(1, {
  numInstructions: 4,
  operation: (params, p1, p2) => {
    const r1 = getValue(p1, params[0]);
    const r2 = getValue(p2, params[1]);

    memory[params[2]] = r1 + r2;
    // console.log(`Addition, params: ${params}. p1: ${p1}, p2: ${p2}. Adding ${r1} and ${r2} and setting in memory position ${params[2]}`);
    return true;
  },
});
INSTRUCTIONS.set(2, {
  numInstructions: 4,
  operation: (params, p1, p2, p3) => {
    const r1 = getValue(p1, params[0]);
    const r2 = getValue(p2, params[1]);
    memory[params[2]] = r1 * r2;
    return true;
  },
});
INSTRUCTIONS.set(3, {
  numInstructions: 2,
  operation: (params, p1, p2, p3) => {
    memory[params[0]] = io;
    // console.log(`Set memory position ${params[0]} to input ${io}`);
    return true;
  },
});
INSTRUCTIONS.set(4, {
  numInstructions: 2,
  operation: (params, p1, p2, p3) => {
    const r1 = getValue(p1, params[0]);

    console.log(`Outputting value with ${params[0]} and mode ${p1}: ${r1}`);
    return true;
  },
});
INSTRUCTIONS.set(99, {
  numInstructions: 4,
  operation: (params) => {
    console.log('******* opcode 99 -  Halt ');
    // process.exit(); in future maybe
    return false;
  },
});
// INSTRUCTIONS.set(#, {
//   numInstructions: #, // num parameters + 1 for code
//   operation: (params) => {
//     return true;
//   },
// });

input = input.split(',');
let memory = [];
for (let ndx = 0; ndx < 2000; ndx++) {
  memory.push(0);
}

for (let address = 0; address < input.length; address ++) {
  memory[address] = parseInt(input[address]);
}

// Run program using Intcode computer.
function runProgram() {
  let instrPointer = 0;
  while (instrPointer < memory.length) {
    const code = memory[instrPointer];
    const codeStr = code + '';
    const opcode = code == 99 ? 99 : parseInt(
      (codeStr.length > 1 ? codeStr[codeStr.length - 2] : '0')
       + codeStr[codeStr.length - 1]);


    const p1 = codeStr.length > 2 ? parseInt(codeStr[codeStr.length - 3]) : 0;
    const p2 = codeStr.length > 3 ? parseInt(codeStr[codeStr.length - 4]) : 0;
    const p3 = codeStr.length > 4 ? parseInt(codeStr[codeStr.length - 5]) : 0;
    console.log(`Opcode: ${codeStr}. p1: ${p1} p2: ${p2} p3: ${p3}`);
    const instruction = INSTRUCTIONS.get(opcode);
    const numInstructions = instruction.numInstructions;

    const params = memory.slice(instrPointer + 1, instrPointer + numInstructions);

    if (!instruction.operation(params, p1, p2, p3)) {
      return;
    }

    instrPointer += numInstructions;
    console.log(memory.slice(0, 10));
    console.log();
  }
}
runProgram();


// ----------- GUESSES --------------------------
