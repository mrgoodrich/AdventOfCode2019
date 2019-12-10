// ----------- PACKAGES -----------------------
const fs = require('fs');
const {all, any, contains, enumerate, filter, iter, map, max, min, partition, permutations, range, reduce, reduce_, sorted, sum, toArray, zip, zip3} = require('iter-tools');
const pycollections = require('pycollections');
// ----------- INPUT SETUP --------------------
let input = fs.readFileSync('inputs/input', 'utf8');
input = input.split(',');
var Map = require("collections/map");


// ----------- TESTING AND REGEX -----®---------
const isTest = false;

// ----------- SOLUTION ------------------------

const MAX_NUM_INTCODE_PARAMS = 3;
const ADDITIONAL_MEMORY = 30446338;

class Computer {
  constructor(name, inputStream, outputStream) {
    this.name = name;
    this.inputStream = inputStream;
    this.outputStream = outputStream;
    this.halted = false;
    this.instrPointer = 0;
    this.relativeBase = 0;

    this._initMemory();
  }

  _initMemory() {
    this.memory = [];

    for (let address = 0; address < input.length; address ++) {
      this.memory.push(parseInt(input[address]));
    }

    for (let ndx = 0; ndx < ADDITIONAL_MEMORY; ndx++) {
      this.memory.push(0);
    }
  }
  hasInput() {
    return this.inputStream.length;
  }
  readInput() {
    let readValue = this.inputStream[0];
    this.inputStream.splice(0, 1);
    return readValue;
  }
  sendOutput(output) {
    this.lastOutput = output;
    this.outputStream.push(output);
  }
  getOutput() {
    return this.outputStream;
  }
  getLastOutput() {
    return this.lastOutput;
  }
  hasHalted() {
    return this.halted;
  }

  _resolveVal(mode, param) {
    switch (mode) {
      case 0:
        return this.memory[param];
      case 1:
        return param;
      case 2:
        return this.memory[this.relativeBase + param];
      default:
        console.log('Unsupported mode: ' + mode);
        process.exit();
    }
  }

  _resolveTarget(mode, param) {
    switch (mode) {
      case 0:
        return param;
      case 1:
        break;
      case 2:
        return this.relativeBase + param;
      default:
        console.log('Unsupported mode: ' + mode);
        process.exit();
    }
  }

  runInstruction() {
    const code = this.memory[this.instrPointer];
    const codeStr = code + '';
    const intcode = code == 99 ? 99 : parseInt(
      (codeStr.length > 1 ? codeStr[codeStr.length - 2] : '0')
       + codeStr[codeStr.length - 1]);

    const modes = toArray(
      map((offset) => codeStr.length > (offset - 1) ? parseInt(codeStr[codeStr.length - offset]) : 0,
      range({start: 3, end: 6})
    ));
    const params = this.memory.slice(this.instrPointer + 1, this.instrPointer + MAX_NUM_INTCODE_PARAMS + 1);

    const targets = toArray(
      map(
        ([mode, param]) => this._resolveTarget(mode, param),
        zip(modes, params)
      ));
    const vals = toArray(
      map(
        ([mode, param]) => this._resolveVal(mode, param),
        zip(modes, params)
      ));

    switch (intcode) {
      case 1:
        this.memory[targets[2]] = vals[0] + vals[1];
        this.instrPointer += 4;
        break;
      case 2:
        this.memory[targets[2]] = vals[0] * vals[1];
        this.instrPointer += 4;
        break;
      case 3:
        if (!this.hasInput()) {
          return;
        }
        this.memory[targets[0]] = this.readInput();
        this.instrPointer += 2;
        break;
      case 4:
        this.sendOutput(vals[0]);
        this.instrPointer += 2;
        break;
      case 5:
        if (vals[0] != 0) {
          this.instrPointer = vals[1];
        } else {
          this.instrPointer += 3;
        }
        break;
      case 6:
        if (vals[0] == 0) {
          this.instrPointer = vals[1];
        } else {
          this.instrPointer += 3;
        }
        break;
      case 7:
        this.memory[targets[2]] = (vals[0] < vals[1]) ? 1 : 0;
        this.instrPointer += 4;
        break;
      case 8:
        this.memory[targets[2]] = (vals[0] == vals[1]) ? 1 : 0;
        this.instrPointer += 4;
        break;
      case 9:
        this.relativeBase += vals[0];
        this.instrPointer += 2;
        break;
      case 99:
        this.halted = true;
        break;
      default:
        console.log('Unsupported intcode: ' + intcode);
        process.exit(1);
        break;
    }
  }
}

const computer = new Computer('computer', [2], []);
while (!computer.hasHalted()) {
  computer.runInstruction();
}
console.log(computer.getOutput());

// ----------- GUESSES --------------------------
