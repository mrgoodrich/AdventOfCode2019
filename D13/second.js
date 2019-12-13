// ----------- PACKAGES -----------------------
const fs = require('fs');
const {all, any, contains, enumerate, filter, iter, map, max, min, partition, permutations, range, reduce, reduce_, sorted, sum, toArray, zip, zip3} = require('iter-tools');
const pycollections = require('pycollections');
var readline = require('readline');
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

let inStream = [];
let outStream = [];
const computer = new Computer('computer', inStream, outStream);

var blocks = new pycollections.DefaultDict(function(){return 0});

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const width = 60;
let height = 30;

let frame = 0;
for (let i = 0; i < 100000; i++) {
// while (computer.hasInput()) {
  // console.log('running');
  frame++;
  computer.runInstruction();
}

while (outStream.length) {
  let next = outStream.splice(0, 3);
  let key = next[0] + ',' + next[1];
  let blockType = next[2];

  if (blockType >= 0 && blockType <= 4) {
    // console.log('setting ' + key + ' as ' + blockType);
    blocks.set(key, blockType);
  } else {
    console.log('unknown block type: ' + blockType);
    process.exit(1);
  }
}

var movedBall = false;
var ballX = 0;
var paddleX = 0;

let score = 0;
function createObjects() {
  if (outStream.length > 2) {
    let next = outStream.splice(0, 3);
    let key = next[0] + ',' + next[1];
    let blockType = next[2];

    if (blockType >= 0 && blockType <= 4) {
      // console.log('setting ' + key + ' as ' + blockType);
      blocks.set(key, blockType);
    } else {
      score = blockType;
      console.log("******* SCORE: " + score);
    }
  }
}

// function getBallX() {
//
// }

function runStep() {
  // for (let i = 0; i < 100; i++) {
  let count = 0;
  while (!movedBall && count < 500) {
    // console.log('running');
    computer.runInstruction();
    frame++;
    count++;
    createObjects();
  }

  console.log('\n\n\n');
  console.log('frame: ' + frame);
  console.log('score: ' + score);
  console.log('ball x: ' + ballX);
  console.log('paddle x: ' + paddleX);
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      let blockType = blocks.get(x + ',' + y);
      switch (blockType) {
        case 0:
          line += ' ';
          break;
        case 1:
          line += 'W';
          break;
        case 2:
          line += 'B';
          break;
        case 3:
          line += '-';
          paddleX = x;
          break;
        case 4:
          line += 'O';
          movedBall = false;
          ballX = x;
          break;
        default:
          console.log('unknown block type 2: ' + blockType);
          process.exit(1);
        }
      }
      console.log(line);
  }

  // ----------- Uncomment to manually play
  // if (computer.hasHalted()) {
    // var response;
    // rl.question("Input: ", function (answer) {
        // switch (answer) {
        //   case 'a':
        //     inStream.push(-1);
        //     break;
        //   // case '':
        //   //   runStep();
        //   //   break;
        //   case 'd':
        //     inStream.push(1);
        //     break;
        //   case 's':
        //     inStream.push(0);
        //     break;
        //   case '':
        //     if (paddleX > ballX) {
        //       inStream.push(-1);
        //     } else if (paddleX < ballX) {
        //       inStream.push(1);
        //     } else {
        //       inStream.push(0);
        //     }
        //     break;
        // }

        if (paddleX > ballX) {
          inStream.push(-1);
        } else if (paddleX < ballX) {
          inStream.push(1);
        } else {
          inStream.push(0);
        }

        // Add exit now that I've played and know final score (to prevent endless loop)
        if (score == 15957) {
          process.exit();
        }
        frame++;
        runStep();

    // });
  // }
}
runStep();

// 'empty', 'wall', 'block', 'horizontal paddle', 'ball'


//
// let blockCount = 0;
// for (let ndx = 0; ndx < output.length; ndx += 3) {
//   const xPos = output[ndx];
//   const yPos = output[ndx + 1];
//   const key = [xPos, yPos];
//   const blockType = output[ndx + 2]
//
// }



// while (true) {
//
//   switch (blockType) {
//     case 0:
//       break;
//     case 1:
//       break;
//     case 2:
//       break;
//     case 3:
//       break;
//     case 4:
//       break;
//     default:
// }

// for


// ----------- GUESSES --------------------------
