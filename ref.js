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
