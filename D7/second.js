// ----------- PACKAGES -----------------------
const fs = require('fs');
const {all, any, contains, enumerate, filter, iter, map, max, min, range, reduce, reduce_, sorted, sum, zip, zip3} = require('itertools');
const pycollections = require('pycollections');
// ----------- INPUT SETUP --------------------
let input = fs.readFileSync('inputs/input', 'utf8');
input = input.split(',');
var Map = require("collections/map");


// ----------- TESTING AND REGEX -----®---------
const isTest = false;

// ----------- SOLUTION ------------------------


let combinations = [];
for (let first = 5; first < 10; first++) {
  for (let second = 5; second < 10; second++) {
    for (let third = 5; third < 10; third++) {
      for (let fourth = 5; fourth < 10; fourth++) {
        for (let fifth = 5; fifth < 10; fifth++) {
          let combo = first + '' + second + '' + third + '' + fourth + '' + fifth;
          let counter = new pycollections.Counter(combo.split(''))
          if (counter.mostCommon(1)[0][1] == 1) {
            combinations.push(combo);
          }
        }
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Amplifier {
  constructor(name, input, nextAmpInput) {
    this.name = name;
    this.input = input;
    this.nextAmpInput = nextAmpInput;
    this.halted = false;
    this.runAmplifier();
  }
  readInput() {
    if (this.input.length) {
      let readValue = this.input[0];
      this.input.splice(0, 1);
      // console.log(this.name + ' <- ' + readValue);// + ' with type ' + (typeof readValue));
      return Promise.resolve(readValue);
    } else {
      // console.log(this.name + ' sleeping for input');
      let that = this;
      return sleep(1).then(() => that.readInput());
    }
  }
  sendOutput(output) {
    // console.log(this.name + ' -> ' + output);
    this.lastOutput = output;
    this.nextAmpInput.push(output);
  }

  async getHaltedOutput() {
    if (this.halted) {
      return this.lastOutput;
    } else {
      let that = this;
      return sleep(100).then(() => that.getHaltedOutput());
    }
  }

  async runAmplifier() {
    let ampRef = this;

    let instrPointer = 0;

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
        return Promise.resolve(true);
      },
    });
    INSTRUCTIONS.set(2, {
      numInstructions: 4,
      operation: (params, p1, p2, p3) => {
        const r1 = getValue(p1, params[0]);
        const r2 = getValue(p2, params[1]);
        memory[params[2]] = r1 * r2;
        return Promise.resolve(true);
      },
    });
    INSTRUCTIONS.set(3, {
      numInstructions: 2,
      operation: (params, p1, p2, p3, io) => {
        return this.readInput().then(input => {
          memory[params[0]] = input;
          // console.log(`Set memory position ${params[0]} to input ${memory[params[0]]}`);
          return Promise.resolve(true);
        });
      },
    });
    INSTRUCTIONS.set(4, {
      numInstructions: 2,
      operation: (params, p1, p2, p3) => {
        const r1 = getValue(p1, params[0]);

        // console.log(`Outputting value with ${params[0]} and mode ${p1}: ${r1}`);
        this.sendOutput(r1);
        return Promise.resolve(true);
      },
    });
    INSTRUCTIONS.set(5, {
      numInstructions: 3,
      operation: (params, p1, p2) => {
        const r1 = getValue(p1, params[0]);
        const r2 = getValue(p2, params[1]);

        if (r1 != 0) {
          instrPointer = r2;
          return Promise.resolve(false);
        }

        return Promise.resolve(true);
      },
    });
    INSTRUCTIONS.set(6, {
      numInstructions: 3,
      operation: (params, p1, p2) => {
        const r1 = getValue(p1, params[0]);
        const r2 = getValue(p2, params[1]);

        if (r1 == 0) {
          instrPointer = r2;
          return Promise.resolve(false);
        }

        return Promise.resolve(true);
      },
    });
    INSTRUCTIONS.set(7, {
      numInstructions: 4,
      operation: (params, p1, p2) => {
        const r1 = getValue(p1, params[0]);
        const r2 = getValue(p2, params[1]);

        memory[params[2]] = (r1 < r2) ? 1 : 0;

        return Promise.resolve(true);
      },
    });
    INSTRUCTIONS.set(8, {
      numInstructions: 4,
      operation: (params, p1, p2) => {
        const r1 = getValue(p1, params[0]);
        const r2 = getValue(p2, params[1]);

        memory[params[2]] = (r1 == r2) ? 1 : 0;

        return Promise.resolve(true);
      },
    });
    INSTRUCTIONS.set(99, {
      numInstructions: 4,
      operation: (params) => {
        // console.log('******* opcode 99 -  Halt in amplifier ' + this.name);
        this.halted = true;
      },
    });
    // INSTRUCTIONS.set(#, {
    //   numInstructions: #, // num parameters + 1 for code
    //   operation: (params) => {
    //     return true;
    //   },
    // });

    let memory = [];
    for (let ndx = 0; ndx < 2000; ndx++) {
      memory.push(0);
    }

    for (let address = 0; address < input.length; address ++) {
      memory[address] = parseInt(input[address]);
    }

    async function runInstruction() {
      const code = memory[instrPointer];
      const codeStr = code + '';
      const opcode = code == 99 ? 99 : parseInt(
        (codeStr.length > 1 ? codeStr[codeStr.length - 2] : '0')
         + codeStr[codeStr.length - 1]);


      const p1 = codeStr.length > 2 ? parseInt(codeStr[codeStr.length - 3]) : 0;
      const p2 = codeStr.length > 3 ? parseInt(codeStr[codeStr.length - 4]) : 0;
      const p3 = codeStr.length > 4 ? parseInt(codeStr[codeStr.length - 5]) : 0;
      // console.log(`Opcode: ${codeStr}. p1: ${p1} p2: ${p2} p3: ${p3}`);
      const instruction = INSTRUCTIONS.get(opcode);
      const numInstructions = instruction.numInstructions;

      const params = memory.slice(instrPointer + 1, instrPointer + numInstructions);

      const modifiedPointer = !(await instruction.operation(params, p1, p2, p3));
      // console.log('performed op');
      if (!modifiedPointer) {
        instrPointer += numInstructions;
      }

      if (!ampRef.halted) {
        await runInstruction();
      }
    }
    await runInstruction();
  }
}

async function runAmplifiers(combo) {
  const inputs = [
    [parseInt(combo[0]), 0],
    [parseInt(combo[1])],
    [parseInt(combo[2])],
    [parseInt(combo[3])],
    [parseInt(combo[4])],
  ];
  const ampA = new Amplifier('A', inputs[0], inputs[1]);
  const ampB = new Amplifier('B', inputs[1], inputs[2]);
  const ampC = new Amplifier('C', inputs[2], inputs[3]);
  const ampD = new Amplifier('D', inputs[3], inputs[4]);
  const ampE = new Amplifier('E', inputs[4], inputs[0]);

  return await ampE.getHaltedOutput();
}

async function findLargestOutputSignal() {
  let outputSignals = [];
  for (let combo of combinations) {
    const thisOutputSignal = await runAmplifiers(combo);
    outputSignals.push(thisOutputSignal)
  }
  return max(outputSignals);
}
findLargestOutputSignal().then((largest) => {
  console.log(largest);
});



// ----------- GUESSES --------------------------
