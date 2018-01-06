const fs = require("fs");

const FILES = {
  INPUT_FILE: "input.txt",
  OUTPUT_FILE: "output.txt",
  TEST_OUTPUT: "test_output.txt"
};

const _l = console.log;
const _d = console.dir;

const Runner = function() {
  let data = fs.readFileSync(FILES.INPUT_FILE)
    .toString()
    .replace(/^\d+\n/, "")
    .replace(/\n$/, "")
    .split("\n");

  this.input = [];
    
  while (data[0]) {
    this.input.push(data.splice(1, data[0]));
    data.shift();
  }
};

const Case = function(data) {
  this.data = data.map(el => +el);
};



/*** SOLUTION START ***/
const T = 500;
const N = 100;
const W = 100;
const GOAL = 50;

Case.prototype.solve = function() {
  let count = 0;
  let max;
  let cur;
  let data = this.data.sort((a, b) => b - a);
  
  while (data.length) {
    max = this.data.shift();

    if (max >= GOAL) {
      count++;
    } else {
      let num = Math.ceil(GOAL / max) - 1;

      if (data.length >= num) {
        data.splice(data.length - num);
        count++;
      } else {
        return count;
      }
    }
  }

  return count;
};

/*** END ***/



Runner.prototype.output = function() {
  let output = "";
  this.input
    .map(d => new Case(d))
    .forEach((c, i) => {
      output += (i > 0 ? "\n" : "") + "Case #" + (i + 1) + ": " + c.solve();
    });
  _l(output);
  fs.writeFileSync(FILES.OUTPUT_FILE, output);
};

let Arg = { v: process.argv.slice(2) };
Arg.command = Arg.v[0];
Arg.n = parseInt(Arg.v[1], 10);

const Output = function (file) {
  return fs.readFileSync(file)
          .toString()
          .replace(/\n$/, '')
          .split('\n')
          .map(function(l) { return l.replace(/^Case\s#\d+:\s/, ''); });
};

Runner.prototype.test = function (n) {
  let startTime;
  let endTime;
  let outputData = fs.readFileSync(FILES.OUTPUT_FILE)
    .toString()
    .replace(/\n$/, '')
    .split('\n')
    .map(l => l.replace(/^Case\s#\d+:\s/, ''));
  let cases = ((n == null) ? this.input : this.input.slice(n - 1, n))
    .map(d => new Case(d));

  cases.forEach(function (c, i) {
    let sTime;
    let time;
    let result;
    let correct;
    let j = n == null ? i : n - 1;

    sTime = new Date().getTime();
    result = c.solve();
    time = new Date().getTime() - sTime;
    correct = (result === outputData[j]);

    _l((correct ? '\033[32m' : '\033[31m')
      + '================================================================================' + '\n'
      + '#' + (j + 1) + ' '
      + time + 'ms '
      + correct
      + '\n' + '================================================================================'
    );
    _d(result);
    _d(outputData[j]);
    _l('\n');
  });
};

switch (Arg.command) {
  case "-t":
    test = new Runner().test(Arg.n);
    break;
  default:
    output = new Runner().output();
}
