const fs = require("fs");

const FILES = {
  INPUT_FILE: "input.txt",
  OUTPUT_FILE: "output.txt",
  TEST_OUTPUT: "test_output.txt"
};

const _l = console.log;
const _d = console.dir;

const Runner = function() {
  this.input = fs.readFileSync(FILES.INPUT_FILE)
    .toString()
    .replace(/^\d+\n/, "")
    .replace(/\n$/, "")
    .split("\n");
};

const Case = function(data) {
  this.data = data.split(' ');
};



/*** SOLUTION START ***/

const N = 100;

Case.prototype.solve = function() {
  const R = +this.data[0];
  const C = +this.data[1] * 2 - 1;
  const K = +this.data[2];
  const outIndex = (R % 2) ? 
    2 * K + 1 : 
    2 * K + 2;

  // create table with all pegs in place
  let table = [];

  for (let i = 0; i < R; i++) {
    table[i] = [];
    for (let j = 0; j < C; j++) {
      table[i][j] = {
        peg: +((i % 2) && (j % 2) || !(i % 2) && !(j % 2)),
        prob: 0
      }
    }
  }

  // remove broken pegs
  if (+this.data[3]) {
    brPegs = this.data.slice(4);
    for (let i = 0; i < brPegs.length; i++) {
      if (i % 2) {
        if (+brPegs[i - 1] % 2) {
          table[+brPegs[i - 1]][+brPegs[i] * 2 + 1].peg = 0;
        } else {
          table[+brPegs[i - 1]][+brPegs[i] * 2].peg = 0;
        }
      }
    }
  }



  let res = 'XXX';

  // FAST BOTTOM-UP  solution - O(R * C) //
  
  // set the goal
  table[R-1][outIndex].prob = 1;


  // iterate bottom-up
  for (let i = R-2; i >= 0; i--) {
    for (let j = 0; j < C; j++) {
      if (!table[i][j].peg) {
        // wall
        if (j === 0 || (j === C-1)) {
          table[i][j].prob = 0;
        } else if (!table[i+1][j].peg) {
          // missing peg
          table[i][j].prob = table[i+1][j].prob;
        } else {
          // left peg
          if (j === 1) {
            table[i][j].prob = table[i+1][j+1].prob;
          } else 
          // right peg
          if (j === C - 1) {
            table[i][j].prob = table[i+1][j-1].prob;
          } else {
            // normal peg
            table[i][j].prob = (table[i+1][j-1].prob + table[i+1][j+1].prob) / 2;
          }
        }
      }
    }
  }

  // find maximum
  let max = -1;
  for (let j = 1; j < C; j += 2) {
    if (table[0][j].prob > max) {
      max = table[0][j].prob;
      res = (j - 1) / 2 + ' ' + max.toFixed(6);
    }
  }

  // SLOW TOP-DOWN solution - O(R * C^2) //

  // let max = 0;

  // results row
  // table[R] = [];
  // for (let j = 0; j < C; j++) {
  //   table[R][j] = {prob: 0};
  // }

  // for (let n = 1; n < C; n += 2) {
  //   // first row
  //   for (let j = 0; j < C; j++) {
  //     table[0][j].prob = 0;
  //   }
  //   // left/right columns
  //   for (let i = 0; i < R; i++) {
  //     table[i][0].prob = 0;
  //     table[i][C - 1].prob = 0;
  //   }

  //   // calculate probability for single input
  //   table[0][n].prob = 1;
  //   for (let i = 1; i < R + 1; i++) {
  //     for (let j = 1; j < C - 1; j++) {
  //       table[i][j].prob = 
  //         (j-1 === 1 ? 
  //           table[i-1][j-1].peg * table[i-1][j-1].prob : 
  //           table[i-1][j-1].peg * table[i-1][j-1].prob * 0.5) + 
  //         (table[i-1][j].peg ? 0 : table[i-1][j].prob) +
  //         (j+1 === C-2 ? 
  //           table[i-1][j+1].peg * table[i-1][j+1].prob : 
  //           table[i-1][j+1].peg * table[i-1][j+1].prob * 0.5);
  //     }
  //   }

  //   // take max probability
  //   if (table[R][outIndex].prob > max) {
  //     max = table[R][outIndex].prob;
  //     res = (n - 1) / 2 + ' ' + table[R][outIndex].prob.toFixed(6);
  //   }
  // }

  return res;
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
