/**
 * Coding challenges (HackerRank-style) for the Developer Section.
 * Solve in TypeScript or Kotlin. Use readline()/readLine() for input, console.log/println for output.
 */

export type Difficulty = "Easy" | "Medium";
export type Category = "Problem Solving (Basic)" | "Problem Solving (Intermediate)";

export interface Challenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: Category;
  maxScore: number;
  successRate: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints?: string;
  starterCode: { typescript: string; kotlin: string };
  sampleInput: string;
  sampleOutput: string;
  testCases: { input: string; output: string }[];
}

/** All challenges. Order preserved for list view. */
export const CHALLENGES: Challenge[] = [
  {
    id: "solve-me-first",
    title: "Solve Me First",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 1,
    successRate: "97.59%",
    description: "Welcome! This is an easy challenge. Read two integers from stdin, add them, and print the result.",
    inputFormat: "Two integers A and B, one per line.",
    outputFormat: "A single integer: A + B.",
    starterCode: {
      typescript: `const a = parseInt(readline(), 10);
const b = parseInt(readline(), 10);
console.log(a + b);
`,
      kotlin: `val a = readln().toInt()
val b = readln().toInt()
println(a + b)
`,
    },
    sampleInput: "2\n3",
    sampleOutput: "5",
    testCases: [
      { input: "2\n3", output: "5" },
      { input: "100\n-50", output: "50" },
    ],
  },
  {
    id: "simple-array-sum",
    title: "Simple Array Sum",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 10,
    successRate: "94.83%",
    description: "Given an array of integers, find the sum of its elements. First line: n. Second line: n space-separated integers.",
    inputFormat: "Line 1: n. Line 2: n space-separated integers.",
    outputFormat: "The sum as a single integer.",
    starterCode: {
      typescript: `const n = parseInt(readline(), 10);
const arr = readline().split(" ").map(Number);
let sum = 0;
for (const x of arr) sum += x;
console.log(sum);
`,
      kotlin: `val n = readln().toInt()
val arr = readln().split(" ").map { it.toInt() }
println(arr.sum())
`,
    },
    sampleInput: "6\n1 2 3 4 10 11",
    sampleOutput: "31",
    testCases: [
      { input: "6\n1 2 3 4 10 11", output: "31" },
      { input: "1\n42", output: "42" },
    ],
  },
  {
    id: "compare-the-triplets",
    title: "Compare the Triplets",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 10,
    successRate: "96.10%",
    description: "Alice and Bob each created a problem. You rate them 1–3. Compare a[0] with b[0], a[1] with b[1], a[2] with b[2]. If a[i] > b[i], Alice gets 1; if a[i] < b[i], Bob gets 1. Print [Alice score, Bob score] as two space-separated integers.",
    inputFormat: "Line 1: three integers (Alice). Line 2: three integers (Bob).",
    outputFormat: "Two space-separated integers: Alice's score, then Bob's.",
    starterCode: {
      typescript: `const a = readline().split(" ").map(Number);
const b = readline().split(" ").map(Number);
let alice = 0, bob = 0;
for (let i = 0; i < 3; i++) {
  if (a[i] > b[i]) alice++;
  else if (a[i] < b[i]) bob++;
}
console.log(alice, bob);
`,
      kotlin: `val a = readln().split(" ").map { it.toInt() }
val b = readln().split(" ").map { it.toInt() }
var alice = 0
var bob = 0
for (i in 0..2) {
  when { a[i] > b[i] -> alice++; a[i] < b[i] -> bob++ }
}
println("$alice $bob")
`,
    },
    sampleInput: "5 6 7\n3 6 10",
    sampleOutput: "1 1",
    testCases: [
      { input: "5 6 7\n3 6 10", output: "1 1" },
      { input: "1 2 3\n1 2 3", output: "0 0" },
      { input: "3 2 1\n1 2 3", output: "0 3" },
    ],
  },
  {
    id: "a-very-big-sum",
    title: "A Very Big Sum",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 10,
    successRate: "98.86%",
    description: "Calculate and print the sum of the elements in an array. Numbers may be large (use 64-bit).",
    inputFormat: "Line 1: n. Line 2: n space-separated long integers.",
    outputFormat: "The sum.",
    starterCode: {
      typescript: `const n = parseInt(readline(), 10);
const arr = readline().split(" ").map(BigInt);
const sum = arr.reduce((a, b) => a + b, BigInt(0));
console.log(sum.toString());
`,
      kotlin: `readln().toInt()
val arr = readln().split(" ").map { it.toLong() }
println(arr.sum())
`,
    },
    sampleInput: "5\n1000000001 1000000002 1000000003 1000000004 1000000005",
    sampleOutput: "5000000015",
    testCases: [
      { input: "5\n1000000001 1000000002 1000000003 1000000004 1000000005", output: "5000000015" },
      { input: "1\n9999999999", output: "9999999999" },
    ],
  },
  {
    id: "diagonal-difference",
    title: "Diagonal Difference",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 10,
    successRate: "96.21%",
    description: "Given a square matrix, compute the absolute difference between the sums of its diagonals.",
    inputFormat: "Line 1: n. Next n lines: n space-separated integers per line.",
    outputFormat: "A single integer: |left_diag - right_diag|.",
    starterCode: {
      typescript: `const n = parseInt(readline(), 10);
const m: number[][] = [];
for (let i = 0; i < n; i++) m.push(readline().split(" ").map(Number));
let l = 0, r = 0;
for (let i = 0; i < n; i++) { l += m[i][i]; r += m[i][n - 1 - i]; }
console.log(Math.abs(l - r));
`,
      kotlin: `val n = readln().toInt()
val m = (1..n).map { readln().split(" ").map { it.toInt() } }
var l = 0
var r = 0
for (i in 0 until n) { l += m[i][i]; r += m[i][n - 1 - i] }
println(kotlin.math.abs(l - r))
`,
    },
    sampleInput: "3\n11 2 4\n4 5 6\n10 8 -12",
    sampleOutput: "15",
    testCases: [
      { input: "3\n11 2 4\n4 5 6\n10 8 -12", output: "15" },
      { input: "2\n1 2\n3 4", output: "0" },
    ],
  },
  {
    id: "plus-minus",
    title: "Plus Minus",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 10,
    successRate: "98.46%",
    description: "Given an array, calculate the ratios of positive, negative, and zero elements. Print each on a new line with 6 decimal places.",
    inputFormat: "Line 1: n. Line 2: n space-separated integers.",
    outputFormat: "Three lines: ratio of positive, negative, zero (6 decimals each).",
    starterCode: {
      typescript: `const n = parseInt(readline(), 10);
const arr = readline().split(" ").map(Number);
let pos = 0, neg = 0, zero = 0;
for (const x of arr) { if (x > 0) pos++; else if (x < 0) neg++; else zero++; }
console.log((pos / n).toFixed(6));
console.log((neg / n).toFixed(6));
console.log((zero / n).toFixed(6));
`,
      kotlin: `val n = readln().toInt()
val arr = readln().split(" ").map { it.toInt() }
val pos = arr.count { it > 0 }
val neg = arr.count { it < 0 }
val zero = arr.count { it == 0 }
println("%.6f".format(pos.toDouble() / n))
println("%.6f".format(neg.toDouble() / n))
println("%.6f".format(zero.toDouble() / n))
`,
    },
    sampleInput: "6\n-4 3 -9 0 4 1",
    sampleOutput: "0.500000\n0.333333\n0.166667",
    testCases: [
      { input: "6\n-4 3 -9 0 4 1", output: "0.500000\n0.333333\n0.166667" },
      { input: "3\n1 0 -1", output: "0.333333\n0.333333\n0.333333" },
    ],
  },
  {
    id: "staircase",
    title: "Staircase",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 10,
    successRate: "98.42%",
    description: "Print a staircase of size n: right-aligned '#' with spaces. Line i has i '#' and (n-i) spaces.",
    inputFormat: "A single integer n.",
    outputFormat: "n lines. Each line has spaces then #.",
    starterCode: {
      typescript: `const n = parseInt(readline(), 10);
for (let i = 1; i <= n; i++) {
  console.log(" ".repeat(n - i) + "#".repeat(i));
}
`,
      kotlin: `val n = readln().toInt()
for (i in 1..n) {
  println(" ".repeat(n - i) + "#".repeat(i))
}
`,
    },
    sampleInput: "6",
    sampleOutput: "     #\n    ##\n   ###\n  ####\n #####\n######",
    testCases: [
      { input: "6", output: "     #\n    ##\n   ###\n  ####\n #####\n######" },
      { input: "3", output: "  #\n ##\n###" },
    ],
  },
  {
    id: "mini-max-sum",
    title: "Mini-Max Sum",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 10,
    successRate: "94.71%",
    description: "Given five positive integers, find the minimum and maximum sums of exactly four of the five. Print: minSum maxSum.",
    inputFormat: "One line: five space-separated integers.",
    outputFormat: "Two space-separated long integers: min and max sum.",
    starterCode: {
      typescript: `const arr = readline().split(" ").map(Number);
const sum = arr.reduce((a, b) => a + b, 0);
const mn = sum - Math.max(...arr);
const mx = sum - Math.min(...arr);
console.log(mn, mx);
`,
      kotlin: `val arr = readln().split(" ").map { it.toLong() }
val sum = arr.sum()
println("\${sum - arr.max()} \${sum - arr.min()}")
`,
    },
    sampleInput: "1 2 3 4 5",
    sampleOutput: "10 14",
    testCases: [
      { input: "1 2 3 4 5", output: "10 14" },
      { input: "7 69 2 221 8974", output: "299 9271" },
    ],
  },
  {
    id: "birthday-cake-candles",
    title: "Birthday Cake Candles",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 10,
    successRate: "97.31%",
    description: "You are in charge of the cake. n candles: heights. Only the tallest can be blown. How many are tallest?",
    inputFormat: "Line 1: n. Line 2: n space-separated integers (heights).",
    outputFormat: "Count of the tallest candles.",
    starterCode: {
      typescript: `const n = parseInt(readline(), 10);
const arr = readline().split(" ").map(Number);
const max = Math.max(...arr);
const c = arr.filter(x => x === max).length;
console.log(c);
`,
      kotlin: `readln().toInt()
val arr = readln().split(" ").map { it.toInt() }
val mx = arr.max()
println(arr.count { it == mx })
`,
    },
    sampleInput: "4\n3 2 1 3",
    sampleOutput: "2",
    testCases: [
      { input: "4\n3 2 1 3", output: "2" },
      { input: "1\n5", output: "1" },
    ],
  },
  {
    id: "time-conversion",
    title: "Time Conversion",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 15,
    successRate: "92.75%",
    description: "Convert 12-hour AM/PM time to 24-hour. Input like 07:05:45PM, output 19:05:45.",
    inputFormat: "A single string s in 12-hour format (hh:mm:ssAM or hh:mm:ssPM).",
    outputFormat: "24-hour string (HH:mm:ss).",
    starterCode: {
      typescript: `const s = readline();
const isPm = s.slice(-2) === "PM";
let [h, m, sec] = s.slice(0, -2).split(":").map(Number);
if (isPm && h !== 12) h += 12;
if (!isPm && h === 12) h = 0;
console.log(String(h).padStart(2,"0") + ":" + String(m).padStart(2,"0") + ":" + String(sec).padStart(2,"0"));
`,
      kotlin: `val s = readln()
val isPm = s.endsWith("PM")
var (h, m, sec) = s.dropLast(2).split(":").map { it.toInt() }
if (isPm && h != 12) h += 12
if (!isPm && h == 12) h = 0
println("%02d:%02d:%02d".format(h, m, sec))
`,
    },
    sampleInput: "07:05:45PM",
    sampleOutput: "19:05:45",
    testCases: [
      { input: "07:05:45PM", output: "19:05:45" },
      { input: "12:00:00AM", output: "00:00:00" },
      { input: "12:00:00PM", output: "12:00:00" },
    ],
  },
  // --- 11–20: placeholder structure; expand descriptions and test cases as needed ---
  { id: "grading-students", title: "Grading Students", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 10, successRate: "96.51%", description: "Round grades: if diff to next multiple of 5 is < 3 and grade≥38, round up; else leave. First line: n, then n grades.", inputFormat: "n, then n integers.", outputFormat: "n lines: rounded grades.", starterCode: { typescript: `const n = parseInt(readline(),10); for(let i=0;i<n;i++){ let g=parseInt(readline(),10); const r=(g>=38&&(g%5)>=3)?g+(5-g%5):g; console.log(r); }`, kotlin: `val n=readln().toInt(); repeat(n){ var g=readln().toInt(); if(g>=38 && g%5>=3) g+=5-g%5; println(g) }` }, sampleInput: "4\n73\n67\n38\n33", sampleOutput: "75\n67\n40\n33", testCases: [{ input: "4\n73\n67\n38\n33", output: "75\n67\n40\n33" }] },
  { id: "apple-and-orange", title: "Apple and Orange", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 10, successRate: "96.45%", description: "House [s,t]. Apple tree at a, orange at b. n apples fall at distances d (from a), m oranges from b. Count how many land on the house.", inputFormat: "s t\\na b\\nm n\\napples...\\noranges...", outputFormat: "Two lines: count apples, count oranges.", starterCode: { typescript: `const [s,t]=readline().split(" ").map(Number); const [a,b]=readline().split(" ").map(Number); const [m,n]=readline().split(" ").map(Number); const ap=readline().split(" ").map(Number); const or=readline().split(" ").map(Number); const on=(x:number,pos:number)=>x+pos>=s&&x+pos<=t; console.log(ap.filter(d=>on(d,a)).length); console.log(or.filter(d=>on(d,b)).length);`, kotlin: `val (s,t)=readln().split(" ").map{it.toInt()}; val (a,b)=readln().split(" ").map{it.toInt()}; readln(); val ap=readln().split(" ").map{it.toInt()}; val or=readln().split(" ").map{it.toInt()}; fun on(x:Int,p:Int)=x+p in s..t; println(ap.count{on(it,a)}); println(or.count{on(it,b)})` }, sampleInput: "7 11\n5 15\n3 2\n-2 2 1\n5 -6", sampleOutput: "1\n1", testCases: [{ input: "7 11\n5 15\n3 2\n-2 2 1\n5 -6", output: "1\n1" }] },
  { id: "number-line-jumps", title: "Number Line Jumps", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 10, successRate: "89.97%", description: "Kangaroos start at x1,x2 and jump v1,v2 per step. Do they ever meet? Print YES or NO.", inputFormat: "x1 v1 x2 v2", outputFormat: "YES or NO.", starterCode: { typescript: `const [x1,v1,x2,v2]=readline().split(" ").map(Number); if(v1===v2) console.log(x1===x2?"YES":"NO"); else { const t=(x2-x1)/(v1-v2); console.log(t>=0 && t===Math.floor(t)?"YES":"NO"); }`, kotlin: `val (x1,v1,x2,v2)=readln().split(" ").map{it.toInt()}; if(v1==v2) println(if(x1==x2)"YES" else "NO"); else{ val t=(x2-x1).toDouble()/(v1-v2); println(if(t>=0 && t==t.toLong().toDouble())"YES" else "NO") }` }, sampleInput: "0 3 4 2", sampleOutput: "YES", testCases: [{ input: "0 3 4 2", output: "YES" }, { input: "0 2 5 3", output: "NO" }] },
  { id: "between-two-sets", title: "Between Two Sets", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 10, successRate: "91.34%", description: "Find integers x such that: all elements of a divide x, and x divides all elements of b. Count such x.", inputFormat: "n m\\na[0]...a[n-1]\\nb[0]...b[m-1]", outputFormat: "Count.", starterCode: { typescript: `const [n,m]=readline().split(" ").map(Number); const a=readline().split(" ").map(Number); const b=readline().split(" ").map(Number); const lcm=(x,y)=>{ const g=(a,b)=>b?g(b,a%b):a; return x*y/g(x,y); }; const l=a.reduce(lcm); const g=(a,b)=>b?g(b,a%b):a; const gb=b.reduce(g); let c=0; for(let x=l;x<=gb;x+=l) if(gb%x===0) c++; console.log(c);`, kotlin: `readln(); readln(); val a=readln().split(" ").map{it.toInt()}; val b=readln().split(" ").map{it.toInt()}; fun gcd(x:Int,y:Int):Int=if(y==0)x else gcd(y,x%y); fun lcm(x:Int,y:Int)=x*y/gcd(x,y); val l=a.reduce(::lcm); val gb=b.reduce(::gcd); var c=0; var x=l; while(x<=gb){ if(gb%x==0)c++; x+=l }; println(c)` }, sampleInput: "2 3\n2 4\n16 32 96", sampleOutput: "3", testCases: [{ input: "2 3\n2 4\n16 32 96", output: "3" }] },
  { id: "breaking-the-records", title: "Breaking the Records", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 10, successRate: "98.59%", description: "Games scores. Count how many times she breaks her best and worst. Print: count_high count_low.", inputFormat: "n, then n scores.", outputFormat: "Two integers.", starterCode: { typescript: `const n=parseInt(readline(),10); const s=readline().split(" ").map(Number); let lo=s[0],hi=s[0],ch=0,cl=0; for(let i=1;i<n;i++){ if(s[i]>hi){ hi=s[i]; ch++; } if(s[i]<lo){ lo=s[i]; cl++; } } console.log(ch,cl);`, kotlin: `readln().toInt(); val s=readln().split(" ").map{it.toInt()}; var lo=s[0]; var hi=s[0]; var ch=0; var cl=0; for(i in 1 until s.size){ if(s[i]>hi){ hi=s[i]; ch++ }; if(s[i]<lo){ lo=s[i]; cl++ } }; println("$ch $cl")` }, sampleInput: "9\n10 5 20 20 4 5 2 25 1", sampleOutput: "2 4", testCases: [{ input: "9\n10 5 20 20 4 5 2 25 1", output: "2 4" }] },
  { id: "subarray-division", title: "Subarray Division", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 10, successRate: "94.46%", description: "n squares of chocolate, each with d. Find contiguous segments of length m that sum to d. Count ways.", inputFormat: "n\\narr\\nm d", outputFormat: "Count.", starterCode: { typescript: `const n=parseInt(readline(),10); const arr=readline().split(" ").map(Number); const [m,d]=readline().split(" ").map(Number); let c=0; for(let i=0;i<=n-m;i++){ const s=arr.slice(i,i+m).reduce((a,b)=>a+b,0); if(s===d)c++; } console.log(c);`, kotlin: `readln().toInt(); val arr=readln().split(" ").map{it.toInt()}; val (m,d)=readln().split(" ").map{it.toInt()}; var c=0; for(i in 0..arr.size-m){ if(arr.subList(i,i+m).sum()==d)c++ }; println(c)` }, sampleInput: "5\n1 2 1 3 2\n3 2", sampleOutput: "2", testCases: [{ input: "5\n1 2 1 3 2\n3 2", output: "2" }] },
  { id: "divisible-sum-pairs", title: "Divisible Sum Pairs", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 10, successRate: "97.80%", description: "n integers, k. Count pairs (i,j) with i<j and (ar[i]+ar[j])%k===0.", inputFormat: "n k\\nar", outputFormat: "Count.", starterCode: { typescript: `const [n,k]=readline().split(" ").map(Number); const ar=readline().split(" ").map(Number); let c=0; for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) if((ar[i]+ar[j])%k===0) c++; console.log(c);`, kotlin: `val (n,k)=readln().split(" ").map{it.toInt()}; val ar=readln().split(" ").map{it.toInt()}; var c=0; for(i in 0 until n) for(j in i+1 until n) if((ar[i]+ar[j])%k==0) c++; println(c)` }, sampleInput: "6 3\n1 3 2 6 1 2", sampleOutput: "5", testCases: [{ input: "6 3\n1 3 2 6 1 2", output: "5" }] },
  { id: "migratory-birds", title: "Migratory Birds", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 10, successRate: "92.50%", description: "Array of bird type ids (1-5). Return the smallest id that has the maximum count.", inputFormat: "n, then n integers 1-5.", outputFormat: "Smallest most common type id.", starterCode: { typescript: `const n=parseInt(readline(),10); const arr=readline().split(" ").map(Number); const f=[0,0,0,0,0,0]; for(const x of arr) f[x]++; let best=1; for(let i=2;i<=5;i++) if(f[i]>f[best]) best=i; console.log(best);`, kotlin: `readln().toInt(); val arr=readln().split(" ").map{it.toInt()}; val f=IntArray(6); for(x in arr) f[x]++; var best=1; for(i in 2..5) if(f[i]>f[best]) best=i; println(best)` }, sampleInput: "6\n1 4 4 4 5 3", sampleOutput: "4", testCases: [{ input: "6\n1 4 4 4 5 3", output: "4" }] },
  { id: "day-of-the-programmer", title: "Day of the Programmer", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 15, successRate: "91.10%", description: "Given year y (1700-2700), output the 256th day in dd.mm.yyyy. Account for Julian/Gregorian and leap years in Russia.", inputFormat: "year", outputFormat: "dd.mm.yyyy", starterCode: { typescript: `const y=parseInt(readline(),10); const j=(y%4===0); const g=(y%400===0||(y%4===0&&y%100!==0)); const leap=y<1918?j:g; const feb=y===1918?15:(leap?29:28); const d=256-(31+feb+31+30+31+30+31+31); console.log(String(d).padStart(2,"0")+".09."+y);`, kotlin: `val y=readln().toInt(); val j=(y%4==0); val g=(y%400==0||(y%4==0&&y%100!=0)); val leap=if(y<1918) j else g; val feb=if(y==1918) 15 else if(leap) 29 else 28; val d=256-(31+feb+31+30+31+30+31+31); println("%02d.09.%d".format(d,y))` }, sampleInput: "2017", sampleOutput: "13.09.2017", testCases: [{ input: "2017", output: "13.09.2017" }, { input: "2016", output: "12.09.2016" }] },
  { id: "bill-division", title: "Bill Division", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 10, successRate: "98.08%", description: "n items, k (0-based) Anna declined. Split rest (n-1) items equally. b = amount Anna was charged. Print (b - her share) or Bon Appetit.", inputFormat: "n k\\narr\\nb", outputFormat: "Overcharge or Bon Appetit.", starterCode: { typescript: `const [n,k]=readline().split(" ").map(Number); const arr=readline().split(" ").map(Number); const b=parseInt(readline(),10); const sum=arr.reduce((a,x)=>a+x,0)-arr[k]; const half=sum/2; console.log(b===half?"Bon Appetit":b-half);`, kotlin: `val (n,k)=readln().split(" ").map{it.toInt()}; val arr=readln().split(" ").map{it.toInt()}; val b=readln().toInt(); val half=(arr.sum()-arr[k])/2; println(if(b==half)"Bon Appetit" else b-half)` }, sampleInput: "4 1\n3 10 2 9\n12", sampleOutput: "5", testCases: [{ input: "4 1\n3 10 2 9\n12", output: "5" }] },
  { id: "sales-by-match", title: "Sales by Match", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 10, successRate: "92.87%", description: "n socks, colors in array. Pairs of same color. How many pairs?", inputFormat: "n, then n integers (colors).", outputFormat: "Number of pairs.", starterCode: { typescript: `const n=parseInt(readline(),10); const ar=readline().split(" ").map(Number); const m=new Map<number,number>(); for(const c of ar) m.set(c,(m.get(c)||0)+1); let p=0; for(const v of m.values()) p+=Math.floor(v/2); console.log(p);`, kotlin: `readln().toInt(); val ar=readln().split(" ").map{it.toInt()}; val m=ar.groupingBy{it}.eachCount(); println(m.values.sumOf{it/2})` }, sampleInput: "9\n10 20 20 10 10 30 50 10 20", sampleOutput: "3", testCases: [{ input: "9\n10 20 20 10 10 30 50 10 20", output: "3" }] },
  { id: "drawing-book", title: "Drawing Book", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 10, successRate: "90.28%", description: "n pages, want page p. From front: p/2 turns; from back: (n-p)/2 (n even) or (n-p+1)/2. Return min turns.", inputFormat: "n\\np", outputFormat: "Min page turns.", starterCode: { typescript: `const n=parseInt(readline(),10); const p=parseInt(readline(),10); const front=Math.floor(p/2); const back=Math.floor((n%2===0?n-p+1:n-p)/2); console.log(Math.min(front,back));`, kotlin: `val n=readln().toInt(); val p=readln().toInt(); val front=p/2; val back=if(n%2==0)(n-p+1)/2 else (n-p)/2; println(minOf(front,back))` }, sampleInput: "6\n2", sampleOutput: "1", testCases: [{ input: "6\n2", output: "1" }, { input: "5\n4", output: "0" }] },
  { id: "counting-valleys", title: "Counting Valleys", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 15, successRate: "95.24%", description: "Steps: U and D. Start at 0. A valley is a seq of steps below 0 ending at 0. Count valleys.", inputFormat: "n, then string of n U/D.", outputFormat: "Number of valleys.", starterCode: { typescript: `const n=parseInt(readline(),10); const s=readline(); let l=0,c=0; for(const x of s){ if(x==='U'){ l++; if(l===0)c++; } else l--; } console.log(c);`, kotlin: `readln().toInt(); val s=readln(); var l=0; var c=0; for(x in s){ if(x=='U'){ l++; if(l==0)c++ } else l-- }; println(c)` }, sampleInput: "8\nUDDDUDUU", sampleOutput: "1", testCases: [{ input: "8\nUDDDUDUU", output: "1" }] },
  { id: "electronics-shop", title: "Electronics Shop", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 15, successRate: "93.47%", description: "Budget b. Keyboards k[], drives d[]. Max (k[i]+d[j])<=b. If none affordable: -1.", inputFormat: "b n m\\nk[]\\nd[]", outputFormat: "Max total or -1.", starterCode: { typescript: `const [b]=readline().split(" ").map(Number); const k=readline().split(" ").map(Number); const d=readline().split(" ").map(Number); let mx=-1; for(const x of k) for(const y of d) if(x+y<=b && x+y>mx) mx=x+y; console.log(mx);`, kotlin: `val (b)=readln().split(" ").map{it.toInt()}; val k=readln().split(" ").map{it.toInt()}; val d=readln().split(" ").map{it.toInt()}; var mx=-1; for(x in k) for(y in d) if(x+y<=b && x+y>mx) mx=x+y; println(mx)` }, sampleInput: "10 2 3\n3 1\n5 2 8", sampleOutput: "9", testCases: [{ input: "10 2 3\n3 1\n5 2 8", output: "9" }] },
  { id: "cats-and-a-mouse", title: "Cats and a Mouse", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 15, successRate: "97.98%", description: "Positions A, B (cats), C (mouse). Same speed. Who reaches C first? CatA, CatB, or Mouse C.", inputFormat: "q, then q lines: x y z (A,B,C).", outputFormat: "Per query: Cat A, Cat B, or Mouse C.", starterCode: { typescript: `const q=parseInt(readline(),10); for(let i=0;i<q;i++){ const [x,y,z]=readline().split(" ").map(Number); const a=Math.abs(z-x), b=Math.abs(z-y); console.log(a===b?"Mouse C":a<b?"Cat A":"Cat B"); }`, kotlin: `val q=readln().toInt(); repeat(q){ val (x,y,z)=readln().split(" ").map{it.toInt()}; val a=kotlin.math.abs(z-x); val b=kotlin.math.abs(z-y); println(if(a==b)"Mouse C" else if(a<b)"Cat A" else "Cat B") }` }, sampleInput: "2\n1 2 3\n1 3 2", sampleOutput: "Cat B\nMouse C", testCases: [{ input: "2\n1 2 3\n1 3 2", output: "Cat B\nMouse C" }] },
  { id: "forming-a-magic-square", title: "Forming a Magic Square", difficulty: "Medium", category: "Problem Solving (Basic)", maxScore: 20, successRate: "79.99%", description: "3x3 matrix. Convert to magic square (row/col/diag sum 15) with min |change|. Return total cost (treat each change as 1).", inputFormat: "3 lines of 3 ints.", outputFormat: "Min cost.", starterCode: { typescript: `const m=[]; for(let i=0;i<3;i++) m.push(readline().split(" ").map(Number)); const ms=[[8,1,6,3,5,7,4,9,2],[6,1,8,7,5,3,2,9,4],[4,9,2,3,5,7,8,1,6],[2,9,4,7,5,3,6,1,8],[8,3,4,1,5,9,6,7,2],[4,3,8,9,5,1,2,7,6],[6,7,2,1,5,9,8,3,4],[2,7,6,9,5,1,4,3,8]]; const flat=(a:number[][])=>a.flat(); const f=flat(m); let best=1e9; for(const t of ms){ let c=0; for(let i=0;i<9;i++) c+=Math.abs(f[i]-t[i]); best=Math.min(best,c); } console.log(best);`, kotlin: `val m=(1..3).map{readln().split(" ").map{it.toInt()}}.flatten(); val ms=listOf(listOf(8,1,6,3,5,7,4,9,2),listOf(6,1,8,7,5,3,2,9,4),listOf(4,9,2,3,5,7,8,1,6),listOf(2,9,4,7,5,3,6,1,8),listOf(8,3,4,1,5,9,6,7,2),listOf(4,3,8,9,5,1,2,7,6),listOf(6,7,2,1,5,9,8,3,4),listOf(2,7,6,9,5,1,4,3,8)); var best=1e9.toInt(); for(t in ms){ var c=0; for(i in 0..8) c+=kotlin.math.abs(m[i]-t[i]); best=minOf(best,c) }; println(best)` }, sampleInput: "4 9 2\n3 5 7\n8 1 5", sampleOutput: "1", testCases: [{ input: "4 9 2\n3 5 7\n8 1 5", output: "1" }] },
  { id: "picking-numbers", title: "Picking Numbers", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 20, successRate: "90.69%", description: "Subset where max-min<=1. Return max subset size.", inputFormat: "n, then n integers.", outputFormat: "Max length.", starterCode: { typescript: `const n=parseInt(readline(),10); const a=readline().split(" ").map(Number); const f=new Array(101).fill(0); for(const x of a) f[x]++; let mx=0; for(let i=0;i<100;i++) mx=Math.max(mx, f[i]+f[i+1]); console.log(mx);`, kotlin: `readln().toInt(); val a=readln().split(" ").map{it.toInt()}; val f=IntArray(101); for(x in a) f[x]++; var mx=0; for(i in 0..99) mx=maxOf(mx, f[i]+f[i+1]); println(mx)` }, sampleInput: "6\n4 6 5 3 3 1", sampleOutput: "3", testCases: [{ input: "6\n4 6 5 3 3 1", output: "3" }] },
  { id: "climbing-the-leaderboard", title: "Climbing the Leaderboard", difficulty: "Medium", category: "Problem Solving (Basic)", maxScore: 20, successRate: "64.12%", description: "Ranked leaderboard (desc). Alice's scores. For each score, output her rank. Ties share same rank.", inputFormat: "n\\nranked[]\\nm\\nalice[]", outputFormat: "m lines: rank per alice score.", starterCode: { typescript: `readln(); const r=[...new Set(readline().split(" ").map(Number))].sort((a,b)=>b-a); const m=parseInt(readline(),10); const a=readline().split(" ").map(Number); for(const s of a){ let i=r.findIndex(x=>x<=s); if(i<0) i=r.length; console.log(i+1); }`, kotlin: `readln(); val r=readln().split(" ").map{it.toInt()}.distinct().sortedDescending(); readln(); val a=readln().split(" ").map{it.toInt()}; for(s in a){ val i=r.indexOfFirst{it<=s}; println(if(i<0) r.size+1 else i+1) }` }, sampleInput: "7\n100 100 50 40 40 20 10\n4\n5 25 50 120", sampleOutput: "6\n4\n2\n1", testCases: [{ input: "7\n100 100 50 40 40 20 10\n4\n5 25 50 120", output: "6\n4\n2\n1" }] },
  { id: "the-hurdle-race", title: "The Hurdle Race", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 15, successRate: "98.89%", description: "Max height Dan can jump: k. Hurdle heights. Doses add 1 to k. Min doses to clear all?", inputFormat: "n k\\nheights[]", outputFormat: "Min doses (0 if k>=max).", starterCode: { typescript: `const [n,k]=readline().split(" ").map(Number); const h=readline().split(" ").map(Number); const mx=Math.max(...h); console.log(Math.max(0, mx-k));`, kotlin: `val (n,k)=readln().split(" ").map{it.toInt()}; val h=readln().split(" ").map{it.toInt()}; println(maxOf(0, (h.maxOrNull()?:0)-k))` }, sampleInput: "5 4\n1 6 3 5 2", sampleOutput: "2", testCases: [{ input: "5 4\n1 6 3 5 2", output: "2" }] },
  { id: "designer-pdf-viewer", title: "Designer PDF Viewer", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 20, successRate: "98.83%", description: "26 ints: heights of a-z. Word. Area = (max height of chars) * (len) * 1. Return area.", inputFormat: "26 ints\\nword", outputFormat: "Area.", starterCode: { typescript: `const h=readline().split(" ").map(Number); const w=readline(); let mx=0; for(const c of w) mx=Math.max(mx, h[c.charCodeAt(0)-97]); console.log(mx*w.length);`, kotlin: `val h=readln().split(" ").map{it.toInt()}; val w=readln(); val mx=w.maxOfOrNull{h[it.code-97]}?:0; println(mx*w.length)` }, sampleInput: "1 3 1 3 1 4 1 3 2 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5\nabc", sampleOutput: "9", testCases: [{ input: "1 3 1 3 1 4 1 3 2 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5\nabc", output: "9" }] },
  { id: "utopian-tree", title: "Utopian Tree", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 20, successRate: "97.96%", description: "Start 1. n cycles: odd=2x, even=+1. Height after n?", inputFormat: "t, then t lines: n", outputFormat: "Height per test.", starterCode: { typescript: `const t=parseInt(readline(),10); for(let i=0;i<t;i++){ let n=parseInt(readline(),10), h=1; for(let c=0;c<n;c++) h=(c%2===0)?h*2:h+1; console.log(h); }`, kotlin: `val t=readln().toInt(); repeat(t){ var n=readln().toInt(); var h=1; for(c in 0 until n) h=if(c%2==0) h*2 else h+1; println(h) }` }, sampleInput: "3\n0\n1\n4", sampleOutput: "1\n2\n7", testCases: [{ input: "3\n0\n1\n4", output: "1\n2\n7" }] },
  { id: "angry-professor", title: "Angry Professor", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 20, successRate: "96.51%", description: "Cancel if strictly fewer than k students arrive on time (<=0). Output YES/NO.", inputFormat: "t; each: n k, then n arrival times.", outputFormat: "YES or NO per test.", starterCode: { typescript: `const t=parseInt(readline(),10); for(let i=0;i<t;i++){ const [n,k]=readline().split(" ").map(Number); const a=readline().split(" ").map(Number).filter(x=>x<=0).length; console.log(a<k?"YES":"NO"); }`, kotlin: `val t=readln().toInt(); repeat(t){ val (n,k)=readln().split(" ").map{it.toInt()}; val a=readln().split(" ").map{it.toInt()}.count{it<=0}; println(if(a<k)"YES" else "NO") }` }, sampleInput: "2\n4 3\n-1 -3 4 2\n4 2\n0 -1 2 1", sampleOutput: "YES\nNO", testCases: [{ input: "2\n4 3\n-1 -3 4 2\n4 2\n0 -1 2 1", output: "YES\nNO" }] },
  { id: "beautiful-days-at-the-movies", title: "Beautiful Days at the Movies", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 15, successRate: "96.53%", description: "i to j. Day beautiful if |n - reverse(n)| % k === 0. Count beautiful days.", inputFormat: "i j k", outputFormat: "Count.", starterCode: { typescript: `const [i,j,k]=readline().split(" ").map(Number); const rev=(n:number)=>+String(n).split("").reverse().join(""); let c=0; for(let n=i;n<=j;n++) if(Math.abs(n-rev(n))%k===0) c++; console.log(c);`, kotlin: `val (i,j,k)=readln().split(" ").map{it.toInt()}; fun rev(n:Int)=n.toString().reversed().toInt(); var c=0; for(n in i..j) if(kotlin.math.abs(n-rev(n))%k==0) c++; println(c)` }, sampleInput: "20 23 6", sampleOutput: "2", testCases: [{ input: "20 23 6", output: "2" }] },
  { id: "viral-advertising", title: "Viral Advertising", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 15, successRate: "98.69%", description: "Day1: 5 shared, 5/2 liked. Each day: liked*3 shared, floor(shared/2) liked. Total likes after n days?", inputFormat: "n", outputFormat: "Total likes.", starterCode: { typescript: `const n=parseInt(readline(),10); let s=5, t=0; for(let i=0;i<n;i++){ const l=Math.floor(s/2); t+=l; s=l*3; } console.log(t);`, kotlin: `val n=readln().toInt(); var s=5; var t=0; repeat(n){ val l=s/2; t+=l; s=l*3 }; println(t)` }, sampleInput: "3", sampleOutput: "9", testCases: [{ input: "3", output: "9" }] },
  { id: "save-the-prisoner", title: "Save the Prisoner!", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 15, successRate: "83.45%", description: "n prisoners, m sweets, start s. Pass m-1. Who gets the last? 1-indexed.", inputFormat: "t; each: n m s", outputFormat: "Prisoner id per test.", starterCode: { typescript: `const t=parseInt(readline(),10); for(let i=0;i<t;i++){ const [n,m,s]=readline().split(" ").map(Number); const r=(s-1+m-1)%n+1; console.log(r); }`, kotlin: `val t=readln().toInt(); repeat(t){ val (n,m,s)=readln().split(" ").map{it.toInt()}; println((s-1+m-1)%n+1) }` }, sampleInput: "2\n5 2 1\n5 2 2", sampleOutput: "2\n3", testCases: [{ input: "2\n5 2 1\n5 2 2", output: "2\n3" }] },
  { id: "circular-array-rotation", title: "Circular Array Rotation", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 20, successRate: "82.39%", description: "Array a, k right rotations, m queries: index. Output a[(idx) after rotation].", inputFormat: "n k q\\na[]\\nm lines: index", outputFormat: "Value at each queried index.", starterCode: { typescript: `const [n,k,q]=readline().split(" ").map(Number); const a=readline().split(" ").map(Number); const r=k%n; for(let i=0;i<q;i++){ let idx=parseInt(readline(),10); idx=(idx-r+n)%n; console.log(a[idx]); }`, kotlin: `val (n,k,q)=readln().split(" ").map{it.toInt()}; val a=readln().split(" ").map{it.toInt()}; val r=k%n; repeat(q){ var idx=readln().toInt(); idx=(idx-r+n)%n; if(idx<0) idx+=n; println(a[idx]) }` }, sampleInput: "3 2 3\n1 2 3\n0\n1\n2", sampleOutput: "2\n3\n1", testCases: [{ input: "3 2 3\n1 2 3\n0\n1\n2", output: "2\n3\n1" }] },
  { id: "sequence-equation", title: "Sequence Equation", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 20, successRate: "97.75%", description: "Permutation p[1..n]. For x=1..n find y where p(p(y))=x. Output y per x.", inputFormat: "n, then n ints (p[1]..p[n]).", outputFormat: "n lines: y.", starterCode: { typescript: `const n=parseInt(readline(),10); const p=[0,...readline().split(" ").map(Number)]; const inv:number[]=[]; for(let i=1;i<=n;i++) inv[p[i]]=i; for(let x=1;x<=n;x++) console.log(inv[inv[x]]);`, kotlin: `val n=readln().toInt(); val p=listOf(0)+readln().split(" ").map{it.toInt()}; val inv=IntArray(n+1); for(i in 1..n) inv[p[i]]=i; for(x in 1..n) println(inv[inv[x]])` }, sampleInput: "3\n2 3 1", sampleOutput: "2\n3\n1", testCases: [{ input: "3\n2 3 1", output: "2\n3\n1" }] },
  { id: "jumping-on-the-clouds-revisited", title: "Jumping on the Clouds: Revisited", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 15, successRate: "95.21%", description: "Circular clouds 0/1. Start 0, jump k. 1 costs 2. Stop when back to 0. E=100. Final E?", inputFormat: "n k\\nc[]", outputFormat: "E after game.", starterCode: { typescript: `const [n,k]=readline().split(" ").map(Number); const c=readline().split(" ").map(Number); let e=100, i=0; do { i=(i+k)%n; e-=1+c[i]*2; } while(i!==0); console.log(e);`, kotlin: `val (n,k)=readln().split(" ").map{it.toInt()}; val c=readln().split(" ").map{it.toInt()}; var e=100; var i=0; do { i=(i+k)%n; e-=1+c[i]*2 } while(i!=0); println(e)` }, sampleInput: "8 2\n0 0 1 0 0 1 1 0", sampleOutput: "92", testCases: [{ input: "8 2\n0 0 1 0 0 1 1 0", output: "92" }] },
  { id: "find-digits", title: "Find Digits", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 25, successRate: "97.04%", description: "n. Count digits of n that divide n (no 0).", inputFormat: "t, then t lines: n", outputFormat: "Count per test.", starterCode: { typescript: `const t=parseInt(readline(),10); for(let i=0;i<t;i++){ const n=readline(); const num=parseInt(n,10); let c=0; for(const d of n){ const x=+d; if(x!==0 && num%x===0) c++; } console.log(c); }`, kotlin: `val t=readln().toInt(); repeat(t){ val n=readln(); val num=n.toLong(); println(n.count{it!='0' && num%(it-'0').toLong()==0L}) }` }, sampleInput: "2\n12\n1012", sampleOutput: "2\n3", testCases: [{ input: "2\n12\n1012", output: "2\n3" }] },
  { id: "extra-long-factorials", title: "Extra Long Factorials", difficulty: "Medium", category: "Problem Solving (Intermediate)", maxScore: 20, successRate: "95.73%", description: "Compute n! for n up to 100. Print full number.", inputFormat: "n", outputFormat: "n!", starterCode: { typescript: `const n=parseInt(readline(),10); let r=BigInt(1); for(let i=2;i<=n;i++) r*=BigInt(i); console.log(r.toString());`, kotlin: `val n=readln().toInt(); var r=java.math.BigInteger.ONE; for(i in 2..n) r=r.multiply(java.math.BigInteger.valueOf(i.toLong())); println(r)` }, sampleInput: "25", sampleOutput: "15511210043330985984000000", testCases: [{ input: "5", output: "120" }, { input: "25", output: "15511210043330985984000000" }] },
  { id: "append-and-delete", title: "Append and Delete", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 20, successRate: "71.79%", description: "s, t, k. Can we make s into t with exactly k append/delete? Append: add char at end. Delete: remove last. Print Yes/No.", inputFormat: "s\\nt\\nk", outputFormat: "Yes or No.", starterCode: { typescript: `const s=readline(), t=readline(); const k=parseInt(readline(),10); let i=0; while(i<s.length && i<t.length && s[i]===t[i]) i++; const d=s.length-i+t.length-i; const ok=(k>=d && (k-d)%2===0) || k>=s.length+t.length; console.log(ok?"Yes":"No");`, kotlin: `val s=readln(); val t=readln(); val k=readln().toInt(); var i=0; while(i<s.length && i<t.length && s[i]==t[i]) i++; val d=s.length-i+t.length-i; val ok=(k>=d && (k-d)%2==0) || k>=s.length+t.length; println(if(ok)"Yes" else "No")` }, sampleInput: "hackerhappy\nhackerrank\n9", sampleOutput: "Yes", testCases: [{ input: "hackerhappy\nhackerrank\n9", output: "Yes" }] },
  { id: "sherlock-and-squares", title: "Sherlock and Squares", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 20, successRate: "87.73%", description: "a to b (inclusive). Count integers n where n is a perfect square.", inputFormat: "q; each: a b", outputFormat: "Count per query.", starterCode: { typescript: `const q=parseInt(readline(),10); for(let i=0;i<q;i++){ const [a,b]=readline().split(" ").map(Number); const lo=Math.ceil(Math.sqrt(a)), hi=Math.floor(Math.sqrt(b)); console.log(Math.max(0, hi-lo+1)); }`, kotlin: `val q=readln().toInt(); repeat(q){ val (a,b)=readln().split(" ").map{it.toInt()}; val lo=kotlin.math.ceil(kotlin.math.sqrt(a.toDouble())).toInt(); val hi=kotlin.math.floor(kotlin.math.sqrt(b.toDouble())).toInt(); println(maxOf(0, hi-lo+1)) }` }, sampleInput: "2\n3 9\n17 24", sampleOutput: "2\n0", testCases: [{ input: "2\n3 9\n17 24", output: "2\n0" }] },
  { id: "library-fine", title: "Library Fine", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 15, successRate: "90.34%", description: "Return d1,m1,y1; due d2,m2,y2. Fine: 0 if on/before. 15*(d1-d2) if same month/year, 500*(m1-m2) if same year, 10000 if y1>y2.", inputFormat: "d1 m1 y1\\nd2 m2 y2", outputFormat: "Fine amount.", starterCode: { typescript: `const [d1,m1,y1]=readline().split(" ").map(Number); const [d2,m2,y2]=readline().split(" ").map(Number); if(y1<y2 || (y1===y2 && m1<m2) || (y1===y2 && m1===m2 && d1<=d2)) console.log(0); else if(y1>y2) console.log(10000); else if(m1>m2) console.log(500*(m1-m2)); else console.log(15*(d1-d2));`, kotlin: `val (d1,m1,y1)=readln().split(" ").map{it.toInt()}; val (d2,m2,y2)=readln().split(" ").map{it.toInt()}; println(when{ y1<y2->0; y1==y2 && m1<m2->0; y1==y2 && m1==m2 && d1<=d2->0; y1>y2->10000; m1>m2->500*(m1-m2); else->15*(d1-d2) })` }, sampleInput: "9 6 2015\n6 6 2015", sampleOutput: "45", testCases: [{ input: "9 6 2015\n6 6 2015", output: "45" }] },
  { id: "cut-the-sticks", title: "Cut the sticks", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 25, successRate: "95.21%", description: "Array of lengths. Each turn: cut all by min, remove zeros. Output count remaining each turn until none.", inputFormat: "n, then n ints.", outputFormat: "One per turn: count before cutting.", starterCode: { typescript: `const n=parseInt(readline(),10); let a=readline().split(" ").map(Number); while(a.length){ console.log(a.length); const m=Math.min(...a); a=a.map(x=>x-m).filter(x=>x>0); }`, kotlin: `readln().toInt(); var a=readln().split(" ").map{it.toInt()}.toMutableList(); while(a.isNotEmpty()){ println(a.size); val m=a.minOrNull()!!; a=a.map{it-m}.filter{it>0}.toMutableList() }` }, sampleInput: "6\n5 4 4 2 2 8", sampleOutput: "6\n4\n2\n1", testCases: [{ input: "6\n5 4 4 2 2 8", output: "6\n4\n2\n1" }] },
  { id: "non-divisible-subset", title: "Non-Divisible Subset", difficulty: "Medium", category: "Problem Solving (Intermediate)", maxScore: 20, successRate: "70.70%", description: "Find max subset of S such that no two sum to a multiple of k.", inputFormat: "n k\\nS[]", outputFormat: "Max size.", starterCode: { typescript: `const [n,k]=readline().split(" ").map(Number); const a=readline().split(" ").map(Number); const r=new Array(k).fill(0); for(const x of a) r[x%k]++; let s=Math.min(r[0],1); for(let i=1;i<=k/2;i++){ if(i!==k-i) s+=Math.max(r[i],r[k-i]); else s+=Math.min(r[i],1); } console.log(s);`, kotlin: `val (n,k)=readln().split(" ").map{it.toInt()}; val a=readln().split(" ").map{it.toInt()}; val r=IntArray(k); for(x in a) r[x%k]++; var s=minOf(r[0],1); for(i in 1..k/2) s+=if(i!=k-i) maxOf(r[i],r[k-i]) else minOf(r[i],1); println(s)` }, sampleInput: "4 3\n1 7 2 4", sampleOutput: "3", testCases: [{ input: "4 3\n1 7 2 4", output: "3" }] },
  { id: "repeated-string", title: "Repeated String", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 20, successRate: "90.65%", description: "String s, n. Infinite repeat. Count 'a' in first n chars.", inputFormat: "s\\nn", outputFormat: "Count.", starterCode: { typescript: `const s=readline(); const n=parseInt(readline(),10); const c=(t:string)=>t.split("").filter(x=>x==="a").length; const full=Math.floor(n/s.length)*c(s); const rem=n%s.length; console.log(full+c(s.slice(0,rem)));`, kotlin: `val s=readln(); val n=readln().toLong(); val c={t:String->t.count{it=='a'}}; println(n/s.length*c(s)+c(s.take((n%s.length).toInt())))` }, sampleInput: "aba\n10", sampleOutput: "7", testCases: [{ input: "aba\n10", output: "7" }] },
  { id: "jumping-on-the-clouds", title: "Jumping on the Clouds", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 20, successRate: "94.23%", description: "Array of 0/1. Start 0, end at last. Jump +1 or +2. 1 is thunder. Min jumps?", inputFormat: "n, then n ints (0 or 1).", outputFormat: "Min jumps.", starterCode: { typescript: `const n=parseInt(readline(),10); const c=readline().split(" ").map(Number); let j=0, i=0; while(i<n-1){ if(i+2<n && c[i+2]===0) i+=2; else i+=1; j++; } console.log(j);`, kotlin: `readln().toInt(); val c=readln().split(" ").map{it.toInt()}; var j=0; var i=0; while(i<c.size-1){ if(i+2<c.size && c[i+2]==0) i+=2 else i+=1; j++ }; println(j)` }, sampleInput: "7\n0 0 1 0 0 1 0", sampleOutput: "4", testCases: [{ input: "7\n0 0 1 0 0 1 0", output: "4" }] },
  { id: "equalize-the-array", title: "Equalize the Array", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 20, successRate: "95.07%", description: "Min deletions so all remaining elements are equal.", inputFormat: "n, then n ints.", outputFormat: "Min deletions.", starterCode: { typescript: `const n=parseInt(readline(),10); const a=readline().split(" ").map(Number); const f=new Map<number,number>(); for(const x of a) f.set(x,(f.get(x)||0)+1); const mx=Math.max(...f.values()); console.log(n-mx);`, kotlin: `readln().toInt(); val a=readln().split(" ").map{it.toInt()}; val mx=a.groupingBy{it}.eachCount().values.maxOrNull()!!; println(a.size-mx)` }, sampleInput: "5\n3 3 2 1 3", sampleOutput: "2", testCases: [{ input: "5\n3 3 2 1 3", output: "2" }] },
  { id: "queens-attack-ii", title: "Queen's Attack II", difficulty: "Medium", category: "Problem Solving (Intermediate)", maxScore: 30, successRate: "71.10%", description: "n x n board, queen at (r_q,c_q). k obstacles. In how many squares can the queen attack? (8 dirs, stop at obstacle or edge)", inputFormat: "n k\\nr_q c_q\\nk lines: r c", outputFormat: "Count.", starterCode: { typescript: `const [n,k]=readline().split(" ").map(Number); const [rq,cq]=readline().split(" ").map(Number); const obs=new Set<string>(); for(let i=0;i<k;i++) obs.add(readline().trim()); const move=(dr:number,dc:number)=>{ let r=rq,c=cq, count=0; while(true){ r+=dr; c+=dc; if(r<1||r>n||c<1||c>n||obs.has(r+" "+c)) break; count++; } return count; }; const d=[[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]]; let t=0; for(const [dr,dc] of d) t+=move(dr,dc); console.log(t);`, kotlin: `val (n,k)=readln().split(" ").map{it.toInt()}; val (rq,cq)=readln().split(" ").map{it.toInt()}; val obs=(1..k).map{readln().trim()}.toSet(); fun move(dr:Int,dc:Int):Int{ var r=rq; var c=cq; var cnt=0; while(true){ r+=dr; c+=dc; if(r !in 1..n || c !in 1..n || "$r $c" in obs) break; cnt++ }; return cnt }; val d=listOf(0 to 1,1 to 1,1 to 0,1 to -1,0 to -1,-1 to -1,-1 to 0,-1 to 1); println(d.sumOf{ (a,b)->move(a,b) })` }, sampleInput: "4 0\n4 4", sampleOutput: "9", testCases: [{ input: "4 0\n4 4", output: "9" }] },
  { id: "acm-icpc-team", title: "ACM ICPC Team", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 25, successRate: "90.20%", description: "n people, m topics. String of 0/1 per person. Form 2-person teams. Max topics known by best team? How many teams achieve that?", inputFormat: "n m, then n binary strings.", outputFormat: "Two lines: max topics, number of teams.", starterCode: { typescript: `const [n,m]=readline().split(" ").map(Number); const a=[]; for(let i=0;i<n;i++) a.push(readline()); let mx=0, cnt=0; for(let i=0;i<n;i++) for(let j=i+1;j<n;j++){ let t=0; for(let k=0;k<m;k++) if(a[i][k]==="1"||a[j][k]==="1") t++; if(t>mx){ mx=t; cnt=1; } else if(t===mx) cnt++; } console.log(mx); console.log(cnt);`, kotlin: `val (n,m)=readln().split(" ").map{it.toInt()}; val a=(1..n).map{readln()}; var mx=0; var cnt=0; for(i in 0 until n) for(j in i+1 until n){ val t=(0 until m).count{ a[i][it]=='1' || a[j][it]=='1' }; when{ t>mx->{ mx=t; cnt=1 }; t==mx-> cnt++ } }; println(mx); println(cnt)` }, sampleInput: "4 5\n10101\n11100\n11010\n00101", sampleOutput: "5\n2", testCases: [{ input: "4 5\n10101\n11100\n11010\n00101", output: "5\n2" }] },
  { id: "taum-and-bday", title: "Taum and B'day", difficulty: "Easy", category: "Problem Solving (Basic)", maxScore: 25, successRate: "90.14%", description: "b black, w white. Cost b_cost, w_cost, convert cost. Min total to buy b black and w white (can convert).", inputFormat: "t; each: b w\\nbc wc z", outputFormat: "Min cost per test.", starterCode: { typescript: `const t=parseInt(readline(),10); for(let i=0;i<t;i++){ const [b,w]=readline().split(" ").map(Number); const [bc,wc,z]=readline().split(" ").map(Number); const bl=Math.min(bc, wc+z); const wh=Math.min(wc, bc+z); console.log((b*bl+w*wh).toString()); }`, kotlin: `val t=readln().toInt(); repeat(t){ val (b,w)=readln().split(" ").map{it.toLong()}; val (bc,wc,z)=readln().split(" ").map{it.toLong()}; val bl=minOf(bc, wc+z); val wh=minOf(wc, bc+z); println(b*bl+w*wh) }` }, sampleInput: "1\n10 10\n1 1 1", sampleOutput: "20", testCases: [{ input: "1\n10 10\n1 1 1", output: "20" }] },
  { id: "organizing-containers-of-balls", title: "Organizing Containers of Balls", difficulty: "Medium", category: "Problem Solving (Basic)", maxScore: 30, successRate: "87.38%", description: "n containers, n types. M[i][j]=count of type j in container i. Can we swap (any amount) so each container holds only one type? Possible/Impossible.", inputFormat: "q; each: n, then n x n matrix.", outputFormat: "Possible or Impossible per test.", starterCode: { typescript: `const q=parseInt(readline(),10); for(let i=0;i<q;i++){ const n=parseInt(readline(),10); const M:number[][]=[]; for(let r=0;r<n;r++) M.push(readline().split(" ").map(Number)); const row=M.map(r=>r.reduce((a,b)=>a+b,0)).sort((a,b)=>a-b); const col=[]; for(let c=0;c<n;c++){ let s=0; for(let r=0;r<n;r++) s+=M[r][c]; col.push(s); } col.sort((a,b)=>a-b); const ok=row.every((v,i)=>v===col[i]); console.log(ok?"Possible":"Impossible"); }`, kotlin: `val q=readln().toInt(); repeat(q){ val n=readln().toInt(); val M=(1..n).map{readln().split(" ").map{it.toInt()}}; val row=M.map{it.sum()}.sorted(); val col=(0 until n).map{c->(0 until n).sumOf{M[it][c]}}.sorted(); println(if(row==col)"Possible" else "Impossible") }` }, sampleInput: "2\n2\n1 1\n1 1\n2\n0 2\n1 1", sampleOutput: "Possible\nImpossible", testCases: [{ input: "2\n2\n1 1\n1 1\n2\n0 2\n1 1", output: "Possible\nImpossible" }] },
  {
    id: "encryption",
    title: "Encryption",
    difficulty: "Medium",
    category: "Problem Solving (Basic)",
    maxScore: 30,
    successRate: "92.34%",
    description: "Implement an encryption scheme: (1) Remove all spaces from the string. (2) Calculate grid dimensions: rows = floor(√L), cols = ceil(√L). If rows × cols < L, increment rows. (3) Fill the grid row by row with the characters. (4) Read the grid column by column, joining each column's characters. (5) Output columns separated by spaces.\n\nExample: 'haveaniceday' → length 12 → √12 ≈ 3.46 → rows=3, cols=4 → Grid:\nh a v e\na n i c\ne d a y\nReading columns: 'hae' 'and' 'via' 'ecy' → Output: 'hae and via ecy'",
    inputFormat: "A single string s containing lowercase letters and spaces.",
    outputFormat: "The encrypted string with space-separated column outputs.",
    constraints: "1 ≤ |s| ≤ 81",
    starterCode: {
      typescript: `const s = readline().replace(/\\s/g, "");
const L = s.length;
const sqrtL = Math.sqrt(L);
let rows = Math.floor(sqrtL);
let cols = Math.ceil(sqrtL);
if (rows * cols < L) rows++;
const result: string[] = [];
for (let c = 0; c < cols; c++) {
  let col = "";
  for (let r = 0; r < rows; r++) {
    const idx = r * cols + c;
    if (idx < L) col += s[idx];
  }
  result.push(col);
}
console.log(result.join(" "));
`,
      kotlin: `val s = readln().replace(" ", "")
val L = s.length
val sqrtL = kotlin.math.sqrt(L.toDouble())
var rows = sqrtL.toInt()
var cols = kotlin.math.ceil(sqrtL).toInt()
if (rows * cols < L) rows++
val result = mutableListOf<String>()
for (c in 0 until cols) {
  var col = ""
  for (r in 0 until rows) {
    val idx = r * cols + c
    if (idx < L) col += s[idx]
  }
  result.add(col)
}
println(result.joinToString(" "))
`,
    },
    sampleInput: "haveaniceday",
    sampleOutput: "hae and via ecy",
    testCases: [
      { input: "haveaniceday", output: "hae and via ecy" },
      { input: "feedthedog", output: "fto ehg ee dd" },
      { input: "chillout", output: "clu hlt io" },
    ],
  },
  {
    id: "bigger-is-greater",
    title: "Bigger is Greater",
    difficulty: "Medium",
    category: "Problem Solving (Intermediate)",
    maxScore: 35,
    successRate: "82.68%",
    description: "Find the lexicographically smallest string greater than w by rearranging its letters (next permutation algorithm). If no such string exists, return 'no answer'.\n\nAlgorithm: (1) Find the rightmost position i where w[i-1] < w[i]. (2) Find the rightmost position j where w[j] > w[i-1]. (3) Swap w[i-1] and w[j]. (4) Reverse the suffix from position i to the end.\n\nExample: 'hefg' → find pivot at 'e' (position 1) → swap 'e' with 'g' → 'hgef' → reverse suffix 'ef' → 'hegf'",
    inputFormat: "First line: T (number of test cases). Next T lines: each contains a string w.",
    outputFormat: "For each test case, output the next lexicographically greater string or 'no answer'.",
    constraints: "1 ≤ T ≤ 10⁵, 1 ≤ |w| ≤ 100, w contains only lowercase letters",
    starterCode: {
      typescript: `const t = parseInt(readline(), 10);
for (let i = 0; i < t; i++) {
  let w = readline().split("");
  let i = w.length - 1;
  while (i > 0 && w[i - 1] >= w[i]) i--;
  if (i === 0) {
    console.log("no answer");
    continue;
  }
  let j = w.length - 1;
  while (w[j] <= w[i - 1]) j--;
  [w[i - 1], w[j]] = [w[j], w[i - 1]];
  const suffix = w.slice(i).reverse();
  console.log(w.slice(0, i).concat(suffix).join(""));
}
`,
      kotlin: `val t = readln().toInt()
repeat(t) {
  val w = readln().toMutableList()
  var i = w.size - 1
  while (i > 0 && w[i - 1] >= w[i]) i--
  if (i == 0) {
    println("no answer")
    continue
  }
  var j = w.size - 1
  while (w[j] <= w[i - 1]) j--
  w[i - 1] = w[j].also { w[j] = w[i - 1] }
  w.subList(i, w.size).reverse()
  println(w.joinToString(""))
}
`,
    },
    sampleInput: "5\nab\nbb\nhefg\ndhck\ndkhc",
    sampleOutput: "ba\nno answer\nhegf\ndhkc\nhcdk",
    testCases: [
      { input: "1\nab", output: "ba" },
      { input: "1\nbb", output: "no answer" },
      { input: "1\nhefg", output: "hegf" },
      { input: "1\ndhck", output: "dhkc" },
    ],
  },
  {
    id: "modified-kaprekar-numbers",
    title: "Modified Kaprekar Numbers",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 30,
    successRate: "89.67%",
    description: "A modified Kaprekar number n satisfies: square n, split the square into left part l and right part r (where r has exactly d digits, d = number of digits in n), then l + r = n. Find all such numbers in range [p, q].\n\nExample: n=45 → square=2025 → split: l=20, r=25 (r has 2 digits, same as n) → 20+25=45 ✓. If no numbers found, output 'INVALID RANGE'.",
    inputFormat: "Two integers p and q (p ≤ q), one per line.",
    outputFormat: "Print all modified Kaprekar numbers in the range, space-separated, or 'INVALID RANGE' if none exist.",
    constraints: "0 < p < q < 100000",
    starterCode: {
      typescript: `const p = parseInt(readline(), 10);
const q = parseInt(readline(), 10);
const result: number[] = [];
for (let n = p; n <= q; n++) {
  const square = n * n;
  const d = String(n).length;
  const squareStr = String(square);
  const r = parseInt(squareStr.slice(-d) || "0", 10);
  const l = parseInt(squareStr.slice(0, -d) || "0", 10);
  if (l + r === n) result.push(n);
}
if (result.length === 0) console.log("INVALID RANGE");
else console.log(result.join(" "));
`,
      kotlin: `val p = readln().toInt()
val q = readln().toInt()
val result = mutableListOf<Int>()
for (n in p..q) {
  val square = n.toLong() * n
  val d = n.toString().length
  val squareStr = square.toString()
  val r = if (squareStr.length >= d) squareStr.takeLast(d).toInt() else 0
  val l = if (squareStr.length > d) squareStr.dropLast(d).toInt() else 0
  if (l + r == n) result.add(n)
}
if (result.isEmpty()) println("INVALID RANGE")
else println(result.joinToString(" "))
`,
    },
    sampleInput: "1\n100",
    sampleOutput: "1 9 45 55 99",
    testCases: [
      { input: "1\n100", output: "1 9 45 55 99" },
      { input: "100\n300", output: "297" },
      { input: "400\n700", output: "INVALID RANGE" },
    ],
  },
  {
    id: "beautiful-triplets",
    title: "Beautiful Triplets",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 20,
    successRate: "90.98%",
    description: "Count beautiful triplets: three indices i < j < k where arr[j] - arr[i] = d and arr[k] - arr[j] = d. The array is strictly increasing.\n\nExample: arr=[1,2,4,5,7,8,10], d=3 → Triplets: (1,4,7) with values (1,4,7), (2,5,8) with values (2,5,8), (4,7,10) with values (4,7,10) → Answer: 3",
    inputFormat: "First line: n d (space-separated). Second line: n space-separated integers (the array).",
    outputFormat: "A single integer: the count of beautiful triplets.",
    constraints: "1 ≤ n ≤ 10⁴, 1 ≤ d ≤ 20, 0 ≤ arr[i] ≤ 2×10⁴",
    starterCode: {
      typescript: `const [n, d] = readline().split(" ").map(Number);
const arr = readline().split(" ").map(Number);
let count = 0;
for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    if (arr[j] - arr[i] === d) {
      for (let k = j + 1; k < n; k++) {
        if (arr[k] - arr[j] === d) count++;
      }
    }
  }
}
console.log(count);
`,
      kotlin: `val (n, d) = readln().split(" ").map { it.toInt() }
val arr = readln().split(" ").map { it.toInt() }
var count = 0
for (i in 0 until n) {
  for (j in i + 1 until n) {
    if (arr[j] - arr[i] == d) {
      for (k in j + 1 until n) {
        if (arr[k] - arr[j] == d) count++
      }
    }
  }
}
println(count)
`,
    },
    sampleInput: "7 3\n1 2 4 5 7 8 10",
    sampleOutput: "3",
    testCases: [
      { input: "7 3\n1 2 4 5 7 8 10", output: "3" },
      { input: "5 1\n1 2 3 4 5", output: "3" },
      { input: "4 2\n1 3 5 7", output: "1" },
    ],
  },
  {
    id: "minimum-distances",
    title: "Minimum Distances",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 20,
    successRate: "93.76%",
    description: "Find the minimum distance between any two equal elements. Distance = absolute difference of their indices. If all elements are unique, return -1.\n\nExample: a=[7,1,3,4,1,7] → Element 1 at indices 1 and 4 → distance=3. Element 7 at indices 0 and 5 → distance=5. Minimum is 3.",
    inputFormat: "First line: n. Second line: n space-separated integers.",
    outputFormat: "A single integer: the minimum distance, or -1 if all elements are unique.",
    constraints: "1 ≤ n ≤ 10³, 1 ≤ a[i] ≤ 10⁵",
    starterCode: {
      typescript: `const n = parseInt(readline(), 10);
const a = readline().split(" ").map(Number);
let minDist = Infinity;
for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    if (a[i] === a[j]) {
      minDist = Math.min(minDist, j - i);
    }
  }
}
console.log(minDist === Infinity ? -1 : minDist);
`,
      kotlin: `val n = readln().toInt()
val a = readln().split(" ").map { it.toInt() }
var minDist = Int.MAX_VALUE
for (i in 0 until n) {
  for (j in i + 1 until n) {
    if (a[i] == a[j]) {
      minDist = minOf(minDist, j - i)
    }
  }
}
println(if (minDist == Int.MAX_VALUE) -1 else minDist)
`,
    },
    sampleInput: "6\n7 1 3 4 1 7",
    sampleOutput: "3",
    testCases: [
      { input: "6\n7 1 3 4 1 7", output: "3" },
      { input: "3\n1 2 3", output: "-1" },
      { input: "5\n1 1 1 1 1", output: "1" },
    ],
  },
  {
    id: "halloween-sale",
    title: "Halloween Sale",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 20,
    successRate: "91.22%",
    description: "Buy video games with decreasing prices: first game costs p, each next costs d less, but price never goes below m. With budget s, how many games can you buy?\n\nExample: p=20, d=3, m=6, s=80 → Prices: 20, 17, 14, 11, 8, 6, 6... → Can buy: 20+17+14+11+8+6=76 → 6 games (can't afford 7th at 6)",
    inputFormat: "Four space-separated integers: p d m s",
    outputFormat: "A single integer: the number of games you can buy.",
    constraints: "1 ≤ m ≤ p ≤ 100, 1 ≤ d ≤ 100, 1 ≤ s ≤ 10⁶",
    starterCode: {
      typescript: `const [p, d, m, s] = readline().split(" ").map(Number);
let budget = s;
let count = 0;
let price = p;
while (budget >= price) {
  budget -= price;
  count++;
  price = Math.max(price - d, m);
}
console.log(count);
`,
      kotlin: `val (p, d, m, s) = readln().split(" ").map { it.toInt() }
var budget = s
var count = 0
var price = p
while (budget >= price) {
  budget -= price
  count++
  price = maxOf(price - d, m)
}
println(count)
`,
    },
    sampleInput: "20 3 6 80",
    sampleOutput: "6",
    testCases: [
      { input: "20 3 6 80", output: "6" },
      { input: "20 3 6 85", output: "7" },
      { input: "100 1 1 99", output: "0" },
    ],
  },
  {
    id: "the-time-in-words",
    title: "The Time in Words",
    difficulty: "Medium",
    category: "Problem Solving (Basic)",
    maxScore: 25,
    successRate: "92.99%",
    description: "Convert numeric time (h:m) to words. Rules: m=0 → 'h o' clock', m=15 → 'quarter past h', m=30 → 'half past h', m=45 → 'quarter to h+1', 1≤m≤30 → 'm minutes past h', m>30 → '(60-m) minutes to h+1'.\n\nExample: 5:47 → 60-47=13 → 'thirteen minutes to six'. 3:00 → 'three o' clock'. 7:15 → 'quarter past seven'",
    inputFormat: "First line: h (1-12). Second line: m (0-59).",
    outputFormat: "The time in words as a string.",
    constraints: "1 ≤ h ≤ 12, 0 ≤ m < 60",
    starterCode: {
      typescript: `const h = parseInt(readline(), 10);
const m = parseInt(readline(), 10);
const nums = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const getNum = (n: number) => {
  if (n <= 20) return nums[n];
  return "twenty " + nums[n - 20];
};
if (m === 0) {
  console.log(nums[h] + " o' clock");
} else if (m === 15) {
  console.log("quarter past " + nums[h]);
} else if (m === 30) {
  console.log("half past " + nums[h]);
} else if (m === 45) {
  console.log("quarter to " + nums[h === 12 ? 1 : h + 1]);
} else if (m < 30) {
  const minWord = m === 1 ? "minute" : "minutes";
  console.log(getNum(m) + " " + minWord + " past " + nums[h]);
} else {
  const rem = 60 - m;
  const minWord = rem === 1 ? "minute" : "minutes";
  console.log(getNum(rem) + " " + minWord + " to " + nums[h === 12 ? 1 : h + 1]);
}
`,
      kotlin: `val h = readln().toInt()
val m = readln().toInt()
val nums = listOf("", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty")
fun getNum(n: Int): String {
  return if (n <= 20) nums[n] else "twenty " + nums[n - 20]
}
when {
  m == 0 -> println(nums[h] + " o' clock")
  m == 15 -> println("quarter past " + nums[h])
  m == 30 -> println("half past " + nums[h])
  m == 45 -> println("quarter to " + nums[if (h == 12) 1 else h + 1])
  m < 30 -> {
    val minWord = if (m == 1) "minute" else "minutes"
    println(getNum(m) + " " + minWord + " past " + nums[h])
  }
  else -> {
    val rem = 60 - m
    val minWord = if (rem == 1) "minute" else "minutes"
    println(getNum(rem) + " " + minWord + " to " + nums[if (h == 12) 1 else h + 1])
  }
}
`,
    },
    sampleInput: "5\n47",
    sampleOutput: "thirteen minutes to six",
    testCases: [
      { input: "5\n47", output: "thirteen minutes to six" },
      { input: "3\n0", output: "three o' clock" },
      { input: "7\n15", output: "quarter past seven" },
      { input: "5\n30", output: "half past five" },
    ],
  },
  {
    id: "chocolate-feast",
    title: "Chocolate Feast",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 25,
    successRate: "92.61%",
    description: "Bobby has n dollars. Each chocolate costs c. For every m wrappers, exchange for 1 free chocolate. Calculate total chocolates eaten.\n\nExample: n=10, c=2, m=5 → Buy 5 chocolates (10/2) → 5 wrappers → Exchange for 1 more → Eat it → 1 wrapper left → Total: 6 chocolates",
    inputFormat: "First line: t (test cases). Next t lines: n c m (space-separated).",
    outputFormat: "For each test case, output the total number of chocolates.",
    constraints: "1 ≤ t ≤ 1000, 2 ≤ n ≤ 10⁵, 1 ≤ c ≤ n, 2 ≤ m ≤ n",
    starterCode: {
      typescript: `const t = parseInt(readline(), 10);
for (let i = 0; i < t; i++) {
  const [n, c, m] = readline().split(" ").map(Number);
  let chocolates = Math.floor(n / c);
  let wrappers = chocolates;
  while (wrappers >= m) {
    const free = Math.floor(wrappers / m);
    chocolates += free;
    wrappers = wrappers % m + free;
  }
  console.log(chocolates);
}
`,
      kotlin: `val t = readln().toInt()
repeat(t) {
  val (n, c, m) = readln().split(" ").map { it.toInt() }
  var chocolates = n / c
  var wrappers = chocolates
  while (wrappers >= m) {
    val free = wrappers / m
    chocolates += free
    wrappers = wrappers % m + free
  }
  println(chocolates)
}
`,
    },
    sampleInput: "3\n10 2 5\n12 4 4\n6 2 2",
    sampleOutput: "6\n3\n5",
    testCases: [
      { input: "1\n10 2 5", output: "6" },
      { input: "1\n12 4 4", output: "3" },
      { input: "1\n6 2 2", output: "5" },
    ],
  },
  {
    id: "service-lane",
    title: "Service Lane",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 20,
    successRate: "97.25%",
    description: "Service lane has varying widths. For each query (entry i, exit j), find minimum width in segment [i,j]. Output the largest vehicle type that can pass: 1=bike, 2=car, 3=truck.\n\nExample: widths=[2,3,1,2,3,2,3,3], query [0,3] → min width in [2,3,1,2] is 1 → Output: 1 (only bike can pass)",
    inputFormat: "First line: n t (space-separated). Second line: n space-separated integers (widths). Next t lines: i j (space-separated, entry and exit indices).",
    outputFormat: "For each query, output the maximum vehicle type (1, 2, or 3) that can pass.",
    constraints: "2 ≤ n ≤ 10⁵, 1 ≤ t ≤ 1000, 1 ≤ width[i] ≤ 3, 0 ≤ i ≤ j < n",
    starterCode: {
      typescript: `const [n, t] = readline().split(" ").map(Number);
const width = readline().split(" ").map(Number);
for (let i = 0; i < t; i++) {
  const [entry, exit] = readline().split(" ").map(Number);
  let minWidth = 3;
  for (let j = entry; j <= exit; j++) {
    minWidth = Math.min(minWidth, width[j]);
  }
  console.log(minWidth);
}
`,
      kotlin: `val (n, t) = readln().split(" ").map { it.toInt() }
val width = readln().split(" ").map { it.toInt() }
repeat(t) {
  val (entry, exit) = readln().split(" ").map { it.toInt() }
  val minWidth = (entry..exit).minOfOrNull { width[it] } ?: 3
  println(minWidth)
}
`,
    },
    sampleInput: "8 5\n2 3 1 2 3 2 3 3\n0 3\n4 6\n6 7\n3 5\n0 7",
    sampleOutput: "1\n2\n3\n2\n1",
    testCases: [
      { input: "8 1\n2 3 1 2 3 2 3 3\n0 3", output: "1" },
      { input: "8 1\n2 3 1 2 3 2 3 3\n4 6", output: "2" },
      { input: "5 1\n1 1 1 1 1\n0 4", output: "1" },
    ],
  },
  {
    id: "lisas-workbook",
    title: "Lisa's Workbook",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 25,
    successRate: "92.65%",
    description: "Lisa's workbook: n chapters, chapter i has arr[i] problems. Each page holds k problems. A special problem has its problem number (within chapter) equal to the page number. Count special problems.\n\nExample: n=5, k=3, arr=[4,2,6,1,10]. Chapter 1: problems 1-4 on pages 1-2. Problem 1 on page 1 (special), problem 4 on page 2 (special). Continue for all chapters.",
    inputFormat: "First line: n k (space-separated). Second line: n space-separated integers (problems per chapter).",
    outputFormat: "A single integer: the count of special problems.",
    constraints: "1 ≤ n, k, arr[i] ≤ 100",
    starterCode: {
      typescript: `const [n, k] = readline().split(" ").map(Number);
const arr = readline().split(" ").map(Number);
let page = 1;
let special = 0;
for (let i = 0; i < n; i++) {
  const problems = arr[i];
  for (let p = 1; p <= problems; p++) {
    if (p === page) special++;
    if (p % k === 0 && p < problems) page++;
  }
  page++;
}
console.log(special);
`,
      kotlin: `val (n, k) = readln().split(" ").map { it.toInt() }
val arr = readln().split(" ").map { it.toInt() }
var page = 1
var special = 0
for (i in 0 until n) {
  val problems = arr[i]
  for (p in 1..problems) {
    if (p == page) special++
    if (p % k == 0 && p < problems) page++
  }
  page++
}
println(special)
`,
    },
    sampleInput: "5 3\n4 2 6 1 10",
    sampleOutput: "4",
    testCases: [
      { input: "5 3\n4 2 6 1 10", output: "4" },
      { input: "2 3\n4 5", output: "4" },
      { input: "1 1\n1", output: "1" },
    ],
  },
  {
    id: "flatland-space-stations",
    title: "Flatland Space Stations",
    difficulty: "Easy",
    category: "Problem Solving (Intermediate)",
    maxScore: 25,
    successRate: "81.61%",
    description: "Flatland has n cities in a line (0 to n-1). Some cities have space stations. Find the maximum distance from any city to its nearest space station.\n\nExample: n=5, stations at [0,4]. City 0: distance 0, City 1: min(1,3)=1, City 2: min(2,2)=2, City 3: min(3,1)=1, City 4: distance 0. Maximum is 2.",
    inputFormat: "First line: n m (space-separated, m is number of stations). Second line: m space-separated integers (city indices with stations).",
    outputFormat: "A single integer: the maximum distance to nearest space station.",
    constraints: "1 ≤ n ≤ 10⁵, 1 ≤ m ≤ n",
    starterCode: {
      typescript: `const [n, m] = readline().split(" ").map(Number);
const stations = readline().split(" ").map(Number).sort((a, b) => a - b);
let maxDist = 0;
maxDist = Math.max(maxDist, stations[0]);
maxDist = Math.max(maxDist, n - 1 - stations[stations.length - 1]);
for (let i = 0; i < stations.length - 1; i++) {
  const dist = Math.floor((stations[i + 1] - stations[i]) / 2);
  maxDist = Math.max(maxDist, dist);
}
console.log(maxDist);
`,
      kotlin: `val (n, m) = readln().split(" ").map { it.toInt() }
val stations = readln().split(" ").map { it.toInt() }.sorted()
var maxDist = maxOf(stations[0], n - 1 - stations.last())
for (i in 0 until stations.size - 1) {
  val dist = (stations[i + 1] - stations[i]) / 2
  maxDist = maxOf(maxDist, dist)
}
println(maxDist)
`,
    },
    sampleInput: "5 2\n0 4",
    sampleOutput: "2",
    testCases: [
      { input: "5 2\n0 4", output: "2" },
      { input: "6 6\n0 1 2 4 3 5", output: "0" },
      { input: "3 1\n1", output: "1" },
    ],
  },
  {
    id: "fair-rations",
    title: "Fair Rations",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 25,
    successRate: "91.36%",
    description: "N people with B[i] loaves. Each operation gives 1 loaf to person i and 1 to neighbor (i-1 or i+1). Find minimum loaves to make all counts even, or return 'NO'.\n\nExample: B=[2,3,4,5,6] → Person 1 has 3 (odd) → Give to person 1 and 2: [2,4,4,5,6] → Person 3 has 5 (odd) → Give to person 3 and 4: [2,4,4,6,6] → All even. Total: 4 loaves distributed.",
    inputFormat: "First line: N. Second line: N space-separated integers (initial loaves).",
    outputFormat: "The minimum number of loaves (as string) or 'NO'.",
    constraints: "2 ≤ N ≤ 1000, 1 ≤ B[i] ≤ 10",
    starterCode: {
      typescript: `const N = parseInt(readline(), 10);
const B = readline().split(" ").map(Number);
let loaves = 0;
for (let i = 0; i < N - 1; i++) {
  if (B[i] % 2 === 1) {
    B[i]++;
    B[i + 1]++;
    loaves += 2;
  }
}
if (B[N - 1] % 2 === 1) {
  console.log("NO");
} else {
  console.log(loaves.toString());
}
`,
      kotlin: `val N = readln().toInt()
val B = readln().split(" ").map { it.toInt() }.toMutableList()
var loaves = 0
for (i in 0 until N - 1) {
  if (B[i] % 2 == 1) {
    B[i]++
    B[i + 1]++
    loaves += 2
  }
}
println(if (B[N - 1] % 2 == 1) "NO" else loaves.toString())
`,
    },
    sampleInput: "5\n2 3 4 5 6",
    sampleOutput: "4",
    testCases: [
      { input: "5\n2 3 4 5 6", output: "4" },
      { input: "2\n1 2", output: "NO" },
      { input: "3\n2 2 2", output: "0" },
    ],
  },
  {
    id: "cavity-map",
    title: "Cavity Map",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 30,
    successRate: "90.53%",
    description: "An n×n grid of digits (depths). A cell is a cavity if: (1) not on border, (2) all 4 neighbors (up, down, left, right) have strictly smaller depth. Replace cavity cells with 'X'.\n\nExample: Grid:\n1112\n1912\n1892\n1234\nCell (1,1) has depth 9, neighbors: 1,1,1,1 (all < 9) → Cavity → Replace with X. Output:\n1112\n1X12\n18X2\n1234",
    inputFormat: "First line: n. Next n lines: strings of n digits each.",
    outputFormat: "Print the modified grid with 'X' in cavity positions.",
    constraints: "1 ≤ n ≤ 100",
    starterCode: {
      typescript: `const n = parseInt(readline(), 10);
const grid: string[] = [];
for (let i = 0; i < n; i++) {
  grid.push(readline());
}
const result: string[] = [];
for (let i = 0; i < n; i++) {
  let row = "";
  for (let j = 0; j < n; j++) {
    if (i === 0 || i === n - 1 || j === 0 || j === n - 1) {
      row += grid[i][j];
    } else {
      const depth = parseInt(grid[i][j], 10);
      const up = parseInt(grid[i - 1][j], 10);
      const down = parseInt(grid[i + 1][j], 10);
      const left = parseInt(grid[i][j - 1], 10);
      const right = parseInt(grid[i][j + 1], 10);
      if (depth > up && depth > down && depth > left && depth > right) {
        row += "X";
      } else {
        row += grid[i][j];
      }
    }
  }
  result.push(row);
}
for (const row of result) {
  console.log(row);
}
`,
      kotlin: `val n = readln().toInt()
val grid = (1..n).map { readln() }
val result = mutableListOf<String>()
for (i in 0 until n) {
  var row = ""
  for (j in 0 until n) {
    if (i == 0 || i == n - 1 || j == 0 || j == n - 1) {
      row += grid[i][j]
    } else {
      val depth = grid[i][j].toString().toInt()
      val up = grid[i - 1][j].toString().toInt()
      val down = grid[i + 1][j].toString().toInt()
      val left = grid[i][j - 1].toString().toInt()
      val right = grid[i][j + 1].toString().toInt()
      row += if (depth > up && depth > down && depth > left && depth > right) "X" else grid[i][j]
    }
  }
  result.add(row)
}
result.forEach { println(it) }
`,
    },
    sampleInput: "4\n1112\n1912\n1892\n1234",
    sampleOutput: "1112\n1X12\n18X2\n1234",
    testCases: [
      { input: "4\n1112\n1912\n1892\n1234", output: "1112\n1X12\n18X2\n1234" },
      { input: "3\n111\n111\n111", output: "111\n111\n111" },
      { input: "2\n12\n34", output: "12\n34" },
    ],
  },
  {
    id: "manasa-and-stones",
    title: "Manasa and Stones",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 30,
    successRate: "91.65%",
    description: "Start at stone 0. Place n stones. Each stone = previous + a OR previous + b. Find all possible values for the last (n-th) stone, sorted ascending.\n\nFormula: If we use 'a' j times and 'b' (n-1-j) times, last stone = j×a + (n-1-j)×b. Try all j from 0 to n-1.\n\nExample: n=3, a=1, b=2 → j=0: 0+2+2=4, j=1: 0+1+2=3 or 0+2+1=3, j=2: 0+1+1=2 → Unique: [2,3,4]",
    inputFormat: "First line: t (test cases). Next t lines: each line has n a b (space-separated).",
    outputFormat: "For each test case, output the possible last stone values, space-separated, in ascending order.",
    constraints: "1 ≤ t ≤ 10, 1 ≤ n, a, b ≤ 10³",
    starterCode: {
      typescript: `const t = parseInt(readline(), 10);
for (let i = 0; i < t; i++) {
  const [n, a, b] = readline().split(" ").map(Number);
  const results = new Set<number>();
  for (let j = 0; j < n; j++) {
    const value = j * a + (n - 1 - j) * b;
    results.add(value);
  }
  const sorted = Array.from(results).sort((x, y) => x - y);
  console.log(sorted.join(" "));
}
`,
      kotlin: `val t = readln().toInt()
repeat(t) {
  val (n, a, b) = readln().split(" ").map { it.toInt() }
  val results = mutableSetOf<Int>()
  for (j in 0 until n) {
    val value = j * a + (n - 1 - j) * b
    results.add(value)
  }
  println(results.sorted().joinToString(" "))
}
`,
    },
    sampleInput: "2\n3 1 2\n4 10 100",
    sampleOutput: "2 3 4\n30 120 210 300",
    testCases: [
      { input: "1\n3 1 2", output: "2 3 4" },
      { input: "1\n4 10 100", output: "30 120 210 300" },
      { input: "1\n2 1 1", output: "1" },
    ],
  },
  {
    id: "the-grid-search",
    title: "The Grid Search",
    difficulty: "Medium",
    category: "Problem Solving (Basic)",
    maxScore: 30,
    successRate: "77.73%",
    description: "Given large grid G (R×C) and pattern grid P (r×c), determine if P appears as a contiguous sub-grid in G. Check all possible starting positions.\n\nExample: G=\n7283455864\n6731158619\n...\nP=\n9505\n3845\n3530\nCheck if P matches any r×c block in G. Output 'YES' if found, 'NO' otherwise.",
    inputFormat: "First line: t (test cases). For each test: first line R C (grid size), next R lines (grid), then r c (pattern size), next r lines (pattern).",
    outputFormat: "For each test case, output 'YES' if pattern found, 'NO' otherwise.",
    constraints: "1 ≤ t ≤ 5, 1 ≤ R, C, r, c ≤ 1000",
    starterCode: {
      typescript: `const t = parseInt(readline(), 10);
for (let test = 0; test < t; test++) {
  const [R, C] = readline().split(" ").map(Number);
  const G: string[] = [];
  for (let i = 0; i < R; i++) {
    G.push(readline());
  }
  const [r, c] = readline().split(" ").map(Number);
  const P: string[] = [];
  for (let i = 0; i < r; i++) {
    P.push(readline());
  }
  let found = false;
  for (let i = 0; i <= R - r && !found; i++) {
    for (let j = 0; j <= C - c && !found; j++) {
      let match = true;
      for (let pi = 0; pi < r && match; pi++) {
        for (let pj = 0; pj < c && match; pj++) {
          if (G[i + pi][j + pj] !== P[pi][pj]) {
            match = false;
          }
        }
      }
      if (match) found = true;
    }
  }
  console.log(found ? "YES" : "NO");
}
`,
      kotlin: `val t = readln().toInt()
repeat(t) {
  val (R, C) = readln().split(" ").map { it.toInt() }
  val G = (1..R).map { readln() }
  val (r, c) = readln().split(" ").map { it.toInt() }
  val P = (1..r).map { readln() }
  var found = false
  for (i in 0..R - r) {
    for (j in 0..C - c) {
      var match = true
      for (pi in 0 until r) {
        for (pj in 0 until c) {
          if (G[i + pi][j + pj] != P[pi][pj]) {
            match = false
            break
          }
        }
        if (!match) break
      }
      if (match) {
        found = true
        break
      }
    }
    if (found) break
  }
  println(if (found) "YES" else "NO")
}
`,
    },
    sampleInput: "2\n10 10\n7283455864\n6731158619\n8988242643\n3830589324\n2229505813\n5633845374\n6473530293\n7053106601\n0834282956\n4607924137\n3 4\n9505\n3845\n3530\n15 15\n400453592126560\n114213133098692\n474386082879648\n522356951189169\n887109450487496\n252802633388782\n502771484966748\n075975207693780\n511799789562806\n404007454272504\n549043809916080\n962410809534811\n445893523733475\n768705303214174\n650629270887160\n2 2\n99\n99",
    sampleOutput: "YES\nNO",
    testCases: [
      { input: "1\n3 3\n123\n456\n789\n2 2\n23\n56", output: "YES" },
      { input: "1\n2 2\n12\n34\n1 1\n5", output: "NO" },
      { input: "1\n3 3\n111\n111\n111\n2 2\n11\n11", output: "YES" },
    ],
  },
  {
    id: "happy-ladybugs",
    title: "Happy Ladybugs",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 30,
    successRate: "86.49%",
    description: "Ladybugs are happy if adjacent to same color. You can move any ladybug to any empty cell (_). Determine if all can be made happy.\n\nRules: (1) If no empty cells, check if already all happy. (2) If empty cells exist, need at least 2 of each color (except if only one of a color, it can't be happy). Output 'YES' or 'NO'.\n\nExample: 'RBY_YBR' → Has empty → Check counts: R=2, B=2, Y=2 → All have pairs → Can rearrange → YES",
    inputFormat: "First line: g (games). For each game: first line n, second line string b of length n.",
    outputFormat: "For each game, output 'YES' if all ladybugs can be made happy, 'NO' otherwise.",
    constraints: "1 ≤ g ≤ 100, 1 ≤ n ≤ 100",
    starterCode: {
      typescript: `const g = parseInt(readline(), 10);
for (let game = 0; game < g; game++) {
  const n = parseInt(readline(), 10);
  const b = readline();
  const count: { [key: string]: number } = {};
  let hasEmpty = false;
  for (const char of b) {
    if (char === "_") {
      hasEmpty = true;
    } else {
      count[char] = (count[char] || 0) + 1;
    }
  }
  let allHappy = true;
  if (!hasEmpty) {
    for (let i = 0; i < n; i++) {
      if (b[i] !== "_" && (i === 0 || b[i - 1] !== b[i]) && (i === n - 1 || b[i + 1] !== b[i])) {
        allHappy = false;
        break;
      }
    }
  } else {
    for (const char in count) {
      if (count[char] === 1) {
        allHappy = false;
        break;
      }
    }
  }
  console.log(allHappy ? "YES" : "NO");
}
`,
      kotlin: `val g = readln().toInt()
repeat(g) {
  val n = readln().toInt()
  val b = readln()
  val count = mutableMapOf<Char, Int>()
  var hasEmpty = false
  for (char in b) {
    if (char == '_') {
      hasEmpty = true
    } else {
      count[char] = count.getOrDefault(char, 0) + 1
    }
  }
  var allHappy = true
  if (!hasEmpty) {
    for (i in 0 until n) {
      if (b[i] != '_' && (i == 0 || b[i - 1] != b[i]) && (i == n - 1 || b[i + 1] != b[i])) {
        allHappy = false
        break
      }
    }
  } else {
    for ((_, cnt) in count) {
      if (cnt == 1) {
        allHappy = false
        break
      }
    }
  }
  println(if (allHappy) "YES" else "NO")
}
`,
    },
    sampleInput: "4\n7\nRBY_YBR\n6\nX_Y__X\n2\n__\n6\nB_RRBR",
    sampleOutput: "YES\nNO\nYES\nYES",
    testCases: [
      { input: "1\n7\nRBY_YBR", output: "YES" },
      { input: "1\n6\nX_Y__X", output: "NO" },
      { input: "1\n2\n__", output: "YES" },
    ],
  },
  {
    id: "strange-counter",
    title: "Strange Counter",
    difficulty: "Easy",
    category: "Problem Solving (Basic)",
    maxScore: 30,
    successRate: "83.52%",
    description: "Strange counter: starts at 3 at time 1, decrements each second. When it reaches 1, resets to 2×previous start value. Find value at time t.\n\nPattern: Cycle 1: times 1-3, values 3,2,1. Cycle 2: times 4-9, values 6,5,4,3,2,1. Cycle 3: times 10-21, values 12,11,...,1. For time t, find which cycle and calculate value.\n\nExample: t=4 → Cycle 2, position 1 → Value = 6 - (4-4) = 6",
    inputFormat: "A single integer t.",
    outputFormat: "The counter value at time t.",
    constraints: "1 ≤ t ≤ 10¹²",
    starterCode: {
      typescript: `const t = parseInt(readline(), 10);
let time = 1;
let value = 3;
while (time + value <= t) {
  time += value;
  value *= 2;
}
const result = value - (t - time);
console.log(result);
`,
      kotlin: `val t = readln().toLong()
var time = 1L
var value = 3L
while (time + value <= t) {
  time += value
  value *= 2
}
val result = value - (t - time)
println(result)
`,
    },
    sampleInput: "4",
    sampleOutput: "6",
    testCases: [
      { input: "1", output: "3" },
      { input: "4", output: "6" },
      { input: "10", output: "12" },
      { input: "21", output: "1" },
    ],
  },
  {
    id: "3d-surface-area",
    title: "3D Surface Area",
    difficulty: "Medium",
    category: "Problem Solving (Intermediate)",
    maxScore: 30,
    successRate: "93.27%",
    description: "2D grid A[i][j] = height (cubes) at cell (i,j). Calculate total surface area of the 3D shape.\n\nFormula: Top + Bottom + 4 sides. For each cell: top=1, bottom=1, each side = max(0, height - neighbor_height) if neighbor exists, else = height. Sum all faces.\n\nExample: Grid [[1,3,4],[2,2,3],[1,2,4]] → Calculate exposed faces for each cell and sum.",
    inputFormat: "First line: H W (space-separated). Next H lines: W space-separated integers each.",
    outputFormat: "A single integer: the total surface area.",
    constraints: "1 ≤ H, W ≤ 100, 0 ≤ A[i][j] ≤ 100",
    starterCode: {
      typescript: `const [H, W] = readline().split(" ").map(Number);
const A: number[][] = [];
for (let i = 0; i < H; i++) {
  A.push(readline().split(" ").map(Number));
}
let area = 2 * H * W;
for (let i = 0; i < H; i++) {
  for (let j = 0; j < W; j++) {
    if (i === 0) area += A[i][j];
    else area += Math.max(0, A[i][j] - A[i - 1][j]);
    if (i === H - 1) area += A[i][j];
    else area += Math.max(0, A[i][j] - A[i + 1][j]);
    if (j === 0) area += A[i][j];
    else area += Math.max(0, A[i][j] - A[i][j - 1]);
    if (j === W - 1) area += A[i][j];
    else area += Math.max(0, A[i][j] - A[i][j + 1]);
  }
}
console.log(area);
`,
      kotlin: `val (H, W) = readln().split(" ").map { it.toInt() }
val A = (1..H).map { readln().split(" ").map { it.toInt() } }
var area = 2 * H * W
for (i in 0 until H) {
  for (j in 0 until W) {
    if (i == 0) area += A[i][j]
    else area += maxOf(0, A[i][j] - A[i - 1][j])
    if (i == H - 1) area += A[i][j]
    else area += maxOf(0, A[i][j] - A[i + 1][j])
    if (j == 0) area += A[i][j]
    else area += maxOf(0, A[i][j] - A[i][j - 1])
    if (j == W - 1) area += A[i][j]
    else area += maxOf(0, A[i][j] - A[i][j + 1])
  }
}
println(area)
`,
    },
    sampleInput: "3 3\n1 3 4\n2 2 3\n1 2 4",
    sampleOutput: "60",
    testCases: [
      { input: "1 1\n1", output: "6" },
      { input: "3 3\n1 3 4\n2 2 3\n1 2 4", output: "60" },
      { input: "2 2\n1 1\n1 1", output: "20" },
    ],
  },
  {
    id: "absolute-permutation",
    title: "Absolute Permutation",
    difficulty: "Medium",
    category: "Problem Solving (Intermediate)",
    maxScore: 30,
    successRate: "85.00%",
    description: "Find lexicographically smallest permutation P of [1..n] where |P[i] - i| = k for all i (1-indexed), or return -1.\n\nAlgorithm: For each position i, P[i] must be either i+k or i-k. If k=0, return [1,2,...,n]. If n % (2k) ≠ 0, impossible. Otherwise, arrange in blocks: positions 1..k use i+k, positions k+1..2k use i-k, repeat.\n\nExample: n=4, k=2 → P[1]=3, P[2]=4, P[3]=1, P[4]=2 → Check: |3-1|=2, |4-2|=2, |1-3|=2, |2-4|=2 ✓ → Output: '3 4 1 2'",
    inputFormat: "First line: t (test cases). Next t lines: n k (space-separated).",
    outputFormat: "For each test case, output the permutation as space-separated integers, or -1 if impossible.",
    constraints: "1 ≤ t ≤ 10, 1 ≤ n ≤ 10⁵, 0 ≤ k < n",
    starterCode: {
      typescript: `const t = parseInt(readline(), 10);
for (let i = 0; i < t; i++) {
  const [n, k] = readline().split(" ").map(Number);
  if (k === 0) {
    const result: number[] = [];
    for (let j = 1; j <= n; j++) result.push(j);
    console.log(result.join(" "));
  } else if (n % (2 * k) !== 0) {
    console.log(-1);
  } else {
    const result: number[] = [];
    for (let j = 1; j <= n; j++) {
      const block = Math.floor((j - 1) / k);
      if (block % 2 === 0) {
        result.push(j + k);
      } else {
        result.push(j - k);
      }
    }
    console.log(result.join(" "));
  }
}
`,
      kotlin: `val t = readln().toInt()
repeat(t) {
  val (n, k) = readln().split(" ").map { it.toInt() }
  if (k == 0) {
    println((1..n).joinToString(" "))
  } else if (n % (2 * k) != 0) {
    println(-1)
  } else {
    val result = mutableListOf<Int>()
    for (j in 1..n) {
      val block = (j - 1) / k
      result.add(if (block % 2 == 0) j + k else j - k)
    }
    println(result.joinToString(" "))
  }
}
`,
    },
    sampleInput: "3\n2 1\n3 0\n3 2",
    sampleOutput: "2 1\n1 2 3\n-1",
    testCases: [
      { input: "1\n2 1", output: "2 1" },
      { input: "1\n3 0", output: "1 2 3" },
      { input: "1\n3 2", output: "-1" },
      { input: "1\n4 2", output: "3 4 1 2" },
    ],
  },
];

/** Get a challenge by id. */
export function getChallengeById(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

/** Get all challenge ids for static paths. */
export function getAllChallengeIds(): string[] {
  return CHALLENGES.map((c) => c.id);
}
