const arr = [1, 3, 5];
for (const v of arr) {
  console.log(v);
}


for (const ndx in arr) {
  console.log(ndx);
  console.log(arr[ndx]);
}


const m1 = new Map();
m1.set(1, 'test');
for (const entry of m1.entries()) {
  console.log(entry[0]);
  console.log(entry[1]);
}

const counter = new pycollections.Counter(); // ...Counter('abc'.split('a')); the split is making the string into array
// counter.update(['a', 'a', 32, 'false', false, NaN]);
// counter.items();  // counts distinct items     [['a', 2], [32, 1], ['false', 1], [false, 1], [NaN, 1]]
// counter.elements();  // gets array of unique items     ['a', 'a', 32, 'false', false, NaN]
// counter.get('a'); // can get count for specific element  2
// counter.update(['a', 'a', 'b']);  // can add elements - now 4 a's
// counter.subtract({'a': 3});   // can remove elements - now 1 a's. can make count negative too
// counter.mostCommon(2);  // gets [param] of most common elements i.e. maybe [['c', 3], ['b', 2]]

let a = new Set([1,2,3]);
let b = new Set([4,3,2]);
let union = new Set([...a, ...b]); // [...a, ...b] is the same as [...a].concat([...b])   {1,2,3,4}
let intersection = new Set([...a].filter(x => b.has(x))); // {2,3}
let difference = new Set([...a].filter(x => !b.has(x))); // {1}
// If large use
function union(a, b) {
  const result = new Set();
  a.forEach(value => {
    result.add(value);
  });
  b.forEach(value => {
    result.add(value);
  });
  return result;
}

/*
  g = global, i = case insensitive, m = multiline (^ and $ match start/end of LINE)
  [^a-z]+ anything except a-z
  . any single character
  \s whitespace character
  \S non-whitespace character
  \d any digit
  \D non-digit
  \w any word character - [a-zA-Z0-9_]
  (...) capture group
  (a|b) - a or b
  a? - 0 or 1
  a* - 0+
  a+ - 1+
  a{3} - exactly 3
  a{3,} - 3+
  a{3,6} - between 3 and 6
  ^ - start of string
  $ - end of string
  \b - word boundary
  \B - non-word boundary
  (?:) - non capture group, i.e. /(?:Jane|John|Alison)\s(.*?)\s(?:Smith|Smuth)/ only captures middle name
*/

