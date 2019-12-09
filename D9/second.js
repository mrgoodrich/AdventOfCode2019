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
    let relativeBase = 0;

    function resolveParam(mode, param) {
      switch (mode) {
        case 0:
          return memory[param];
        case 1:
          return param;
        case 2:
          return memory[relativeBase + param];
        default:
          console.log('Unsupported mode: ' + mode);
          process.exit();
      }
    }

    function resolveLocation(mode, param) {
      switch (mode) {
        case 0:
          return param;
        case 1:
          console.log('no immediate mode target');
          process.exit();
        case 2:
          return relativeBase + param;
        default:
          console.log('Unsupported mode: ' + mode);
          process.exit();
      }
    }

    const INSTRUCTIONS = new Map();
    INSTRUCTIONS.set(1, {
      numInstructions: 4,
      operation: (params, modes, resolvedParams) => {
        memory[resolveLocation(modes[2], params[2])] = resolvedParams[0] + resolvedParams[1];
        return Promise.resolve(true);
      },
    });
    INSTRUCTIONS.set(2, {
      numInstructions: 4,
      operation: (params, modes, resolvedParams) => {
        memory[resolveLocation(modes[2], params[2])] = resolvedParams[0] * resolvedParams[1];
        return Promise.resolve(true);
      },
    });
    INSTRUCTIONS.set(3, {
      numInstructions: 2,
      operation: (params, modes, resolvedParams) => {
        return this.readInput().then(input => {
          memory[resolveLocation(modes[0], params[0])] = input;
          return Promise.resolve(true);
        });
      },
    });
    INSTRUCTIONS.set(4, {
      numInstructions: 2,
      operation: (params, modes, resolvedParams) => {
        this.sendOutput(resolvedParams[0]);
        return Promise.resolve(true);
      },
    });
    INSTRUCTIONS.set(5, {
      numInstructions: 3,
      operation: (params, modes, resolvedParams) => {
        if (resolvedParams[0] != 0) {
          instrPointer = resolvedParams[1];
          return Promise.resolve(false);
        }

        return Promise.resolve(true);
      },
    });
    INSTRUCTIONS.set(6, {
      numInstructions: 3,
      operation: (params, modes, resolvedParams) => {
        if (resolvedParams[0] == 0) {
          instrPointer = resolvedParams[1];
          return Promise.resolve(false);
        }

        return Promise.resolve(true);
      },
    });
    INSTRUCTIONS.set(7, {
      numInstructions: 4,
      operation: (params, modes, resolvedParams) => {
        memory[resolveLocation(modes[2], params[2])] = (resolvedParams[0] < resolvedParams[1]) ? 1 : 0;

        return Promise.resolve(true);
      },
    });
    INSTRUCTIONS.set(8, {
      numInstructions: 4,
      operation: (params, modes, resolvedParams) => {
        memory[resolveLocation(modes[2], params[2])] = (resolvedParams[0] == resolvedParams[1]) ? 1 : 0;

        return Promise.resolve(true);
      },
    });
    INSTRUCTIONS.set(9, {
      numInstructions: 2,
      operation: (params, modes, resolvedParams) => {
        relativeBase += resolvedParams[0];
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

    let memory = [];
    for (let ndx = 0; ndx < 5000; ndx++) {
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


      const m1 = codeStr.length > 2 ? parseInt(codeStr[codeStr.length - 3]) : 0;
      const m2 = codeStr.length > 3 ? parseInt(codeStr[codeStr.length - 4]) : 0;
      const m3 = codeStr.length > 4 ? parseInt(codeStr[codeStr.length - 5]) : 0;
      // console.log(`Opcode: ${codeStr}. m1: ${m1} m2: ${m2} m3: ${m3}`);
      const instruction = INSTRUCTIONS.get(opcode);
      const numInstructions = instruction.numInstructions;

      const params = memory.slice(instrPointer + 1, instrPointer + numInstructions);

      const modifiedPointer = !(await instruction.operation(params, [m1, m2, m3], [resolveParam(m1, params[0]), resolveParam(m2, params[1]), resolveParam(m3, params[2])]));
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

let output = [];
async function getOutput() {
  const ampA = new Amplifier('A', [2], output);
  return await ampA.getHaltedOutput();
}
getOutput().then(halted => {
  console.log(output);
});



// ----------- GUESSES --------------------------
