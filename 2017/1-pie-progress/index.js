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

  // _l(data);
    
  while (data[0]) {
    let singleCase = [];
    let daysN = +data[0].split(' ')[0];
    singleCase.push(daysN);
    let piesN = +data[0].split(' ')[1];
    singleCase.push(piesN);
    data.shift();
    let pies = [];
    for (let i = 0; i < daysN; i++) {
      pies.push(data.shift().split(' ').map(el => +el));
    }
    singleCase.push(pies);
    this.input.push(singleCase);
  }
};

const Case = function(data) {
  this.data = data;
};

class PriorityQueue {
  constructor(elems, compare) {
    if (compare) {
      this.compare = compare;
    } else {
      this.compare = (a, b) => a > b; 
    }
    
    this.pq = [];
    for (let i = 0; i < elems.length; i++) {
      this.pq_insert(elems[i]);
    }
  }

  static pq_parent(n) {
    return n === 1 ? -1 : Math.floor(n/2);
  }
  
  static pq_young_child(n) {
    return 2 * n;
  }

  pq_swap(x, y) {
    let temp = this.pq[x - 1];
    this.pq[x - 1] = this.pq[y - 1];
    this.pq[y - 1] = temp;
  }

  pq_insert(x) {
    this.pq.push(x);
    this.bubble_up(this.pq.length);
  }

  bubble_up(p) {
    if (PriorityQueue.pq_parent(p) === -1) return;
    
    if (this.compare(this.pq[PriorityQueue.pq_parent(p) - 1], this.pq[p - 1])) {
      this.pq_swap(p, PriorityQueue.pq_parent(p));
      this.bubble_up(PriorityQueue.pq_parent(p));
    } 
  }

  extract_min() {
    let min = -1;

    // _l(this.pq);

    if (!this.pq.length) {
      _l('Queue is empty');
    } else if (this.pq.length === 1) {
      min = this.pq[0].shift();

      if (!this.pq[0].length) {
        this.pq.pop();
      }
    } else {
      min = this.pq[0].shift();
      if (!this.pq[0].length) {
        this.pq[0] = this.pq.pop();
      }
      this.bubble_down(1);
    }

    return min;
  }

  bubble_down(p) {
    let c = PriorityQueue.pq_young_child(p);
    let min_index = p;
   
    // check both children
    for (let i = 0; i <= 1; i++) {
      if (this.pq[c + i - 1]) {
        if (this.compare(this.pq[min_index - 1], this.pq[c + i - 1])) {
          min_index = c + i;
        }
      }
    }

    if (min_index !== p) {
      this.pq_swap(p, min_index);
      this.bubble_down(min_index);
    }
  }
}


/*** SOLUTION START ***/

Case.prototype.solve = function() {
  let daysN = this.data[0];
  let piesN = this.data[1];
  
  // add taxes
  let pies = this.data[2]
    .map(day => {
      return day
        .sort((a, b) => a - b)
        .map((pie, i) => pie + 2 * i + 1)
    });
  
  // _l(pies);

  // build heap
  let piesPQ = new PriorityQueue([], (a, b) => a[0] > b[0]);

  let res = 0;

  for (let i = 0; i < daysN; i++) {
    piesPQ.pq_insert(pies[i]);
    res += piesPQ.extract_min();
    // _l(res);
  }
  // _l('------------');

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
