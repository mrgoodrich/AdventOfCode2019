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

function sliceDict(dict, startKey, length) {
  let slice = [];
  for (let key = startKey; key < startKey + length; key++) {
    slice.push(dict.get(key));
  }
  return slice;
}

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
    this.memory = new pycollections.DefaultDict(() => 0);

    for (let address = 0; address < input.length; address ++) {
      this.memory.set(address, parseInt(input[address]));
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
        return this.memory.get(param);
      case 1:
        return param;
      case 2:
        return this.memory.get(this.relativeBase + param);
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
    const code = this.memory.get(this.instrPointer);
    const codeStr = code + '';
    const intcode = parseInt(
      (codeStr.length > 1 ? codeStr[codeStr.length - 2] : '0')
       + codeStr[codeStr.length - 1]);

    const modes = toArray(
      map((offset) => codeStr.length > (offset - 1) ? parseInt(codeStr[codeStr.length - offset]) : 0,
      range({start: 3, end: 6})
    ));
    const params = sliceDict(this.memory, this.instrPointer + 1, MAX_NUM_INTCODE_PARAMS);

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
        this.memory.set(targets[2], vals[0] + vals[1]);
        this.instrPointer += 4;
        break;
      case 2:
        this.memory.set(targets[2], vals[0] * vals[1]);
        this.instrPointer += 4;
        break;
      case 3:
        if (!this.hasInput()) {
          return;
        }
        this.memory.set(targets[0], this.readInput());
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
        this.memory.set(targets[2], vals[0] < vals[1] ? 1 : 0);
        this.instrPointer += 4;
        break;
      case 8:
        this.memory.set(targets[2], vals[0] == vals[1] ? 1 : 0);
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

let inputStream = [0];
let outputStream = [];
const computer = new Computer('computer', inputStream, outputStream);

let BOARD_SIZE = 100;
let board = new pycollections.DefaultDict(function(){return 0});

let robotPos = [BOARD_SIZE / 2, BOARD_SIZE / 2];
let robotDir = 0; // 0=UP, 1=RIGHT, 2=DOWN, 3=LEFT

let paintedPanels = {};
while (!computer.hasHalted()) {
  computer.runInstruction();

  if (outputStream.length == 2) {
    // console.log(outputStream);
    const color = outputStream[0];
    const direction = outputStream[1];
    // console.log('paint ' + outputStream[0] + ' and move ' + direction);

    // Paint current spot
    board.set(robotPos[0] + ',' + robotPos[1], color);
    // Turn
    robotDir = robotDir + (direction ? 1 : -1);
    if (robotDir == -1) {
      robotDir = 3;
    }
    robotDir %= 4;
    // Move 1 forward
    switch (robotDir) {
      case 0:
        robotPos[1]--;
        break;
      case 1:
        robotPos[0]++;
        break;
      case 2:
        robotPos[1]++;
        break;
      case 3:
        robotPos[0]--;
        break;
      default:
        console.log('unknown dir');
        process.exit(1);
    }

    outputStream.splice(0, 2);

    inputStream.push(board.get(robotPos[0] + ',' + robotPos[1]));
    paintedPanels[robotPos[0] + ',' + robotPos[1]] = 1;
  }
}
console.log(Object.keys(paintedPanels).length);


// ----------- GUESSES --------------------------
