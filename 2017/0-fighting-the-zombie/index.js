const fs = require("fs");

const FILES = {
  INPUT_FILE: "input.txt",
  OUTPUT_FILE: "output.txt",
  TEST_OUTPUT: "test_output.txt"
};

const _l = console.log;
const _d = console.dir;

const Runner = function() {
  this.input = [];

  let data = fs.readFileSync(FILES.INPUT_FILE)
    .toString()
    .replace(/^\d+\n/, "")
    .replace(/\n$/, "")
    .split("\n")
    .map((el, i) => {
      el = el.split(' ');
      if (i % 2 === 0) {
        this.input.push({
          h: el[0],
          s: el[1],
        });
      } else {
        this.input[this.input.length - 1].codes = el;
      }
    });
};

const Case = function(data) {
  this.data = data;
};



/*** SOLUTION START ***/

Case.prototype.solve = function() {
  let h = +this.data.h;
  return Math.max(...this.data.codes.map(el => {
    // get z
    let z = 0;
    if (el.indexOf('-') > -1) {
      z = +el.match(/-\d+/);
    }
    if (el.indexOf('+') > -1) {
      z = +el.match(/\+\d+/);
    }
    
    // get x and y
    let xy = el.match(/\d+/g);
    let x = +xy[0];
    let y = +xy[1];

    // set goal
    let goal = h - z;
    if (goal <= 0) {
      return 1;
    } else if (goal > x * y) {
      return 0;
    } 

    // init dp table
    let res = [];
    for (let i = 1; i <= goal; i++) {
      res[i] = [];
    }

    // calculate
    // i = monster life
    // j = number of rolls
    // k = number of sides
    for (let i = 1; i <= goal; i++) {
      for (let j = 1; j <= x; j++) {
        let sum = 0;
        for (k = 1; k <= y; k++) {
          if (i - k <= 0) {
            sum++;
          } else if (j !== 1) {
            sum += res[i - k][j - 1];
          }
        }
        res[i][j] = sum / y;
      }
    }
    
    let max = 0;
    for (let j = 1; j <= x; j++) {
      if (res[goal][j] > max) {
        max = res[goal][j];
      }
    }

    return max;
  })).toFixed(6);
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
