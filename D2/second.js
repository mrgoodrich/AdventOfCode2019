// ----------- PACKAGES -----------------------
const fs = require('fs');

// ----------- INPUT SETUP --------------------
let input = fs.readFileSync('inputs/input', 'utf8');
var Map = require("collections/map");

// ----------- TESTING AND REGEX -----®---------
const isTest = false;

// ----------- SOLUTION ------------------------

const INSTRUCTIONS = new Map();
INSTRUCTIONS.set(1, {
  numInstructions: 4,
  operation: (params) => {
    memory[params[2]] = memory[params[0]] + memory[params[1]];
    return true;
  },
});
INSTRUCTIONS.set(2, {
  numInstructions: 4,
  operation: (params) => {
    memory[params[2]] = memory[params[0]] * memory[params[1]];
    return true;
  },
});
INSTRUCTIONS.set(99, {
  numInstructions: 4,
  operation: (params) => {
    // console.log('opcode 99');
    // process.exit(); in future maybe
    return false;
  },
});
// INSTRUCTIONS.set(#, {
//   numInstructions: #,
//   operation: (params) => {
//     return true;
//   },
// });

// Split input as array and parse ints.
input = input.split(',');
for (let address = 0; address < input.length; address ++) {
  input[address] = parseInt(input[address]);
}

// Find noun and verb to produce pointer 0 (memory[0] or output) as 19690720.
let memory;
for (let noun = 0; noun < 100; noun++) {
  for (let verb = 0; verb < 100; verb++ ){
    memory = input.slice(0);
    memory[1] = noun;
    memory[2] = verb;
    runProgram();

    const output = memory[0];
    if (output == 19690720) {
      // console.log('noun: ' + noun + ', verb: ' + verb);
      console.log(100 * noun + verb);
    }
  }
}

// Run program using Intcode computer.
function runProgram() {
  let instrPointer = 0;
  while (instrPointer < memory.length) {
    const opcode = memory[instrPointer];
    const instruction = INSTRUCTIONS.get(opcode);
    const numInstructions = instruction.numInstructions;

    const params = memory.slice(instrPointer + 1, instrPointer + numInstructions);

    if (!instruction.operation(params)) {
      return;
    }

    instrPointer += numInstructions;
  }
}


// ----------- GUESSES --------------------------
