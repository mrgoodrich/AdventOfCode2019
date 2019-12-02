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

const counter = new pycollections.Counter('abc'.split('a'));

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
*/

