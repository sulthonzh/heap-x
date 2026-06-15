#!/usr/bin/env node
import { BinaryHeap, PriorityQueue } from '../src/index.js';

function usage() {
  console.log(`heap-x — Binary heap & priority queue CLI

Usage:
  heap-x demo                    Show interactive demo
  heap-x sort <n1> <n2> ...      Heap sort numbers (ascending)
  heap-x sort-max <n1> <n2> ...  Heap sort numbers (descending)
  heap-x topk <k> <n1> <n2> ...  Find top-k largest numbers
  heap-x pq                      Priority queue demo

Examples:
  heap-x demo
  heap-x sort 5 3 8 1 9 2 4
  heap-x topk 3 9 3 7 1 8 5 2 6`);
}

function demo() {
  console.log('=== BinaryHeap Demo ===\n');
  const minHeap = BinaryHeap.min();
  [7, 3, 9, 1, 5, 2, 8, 4, 6, 0].forEach((v) => minHeap.insert(v));
  console.log('Min-Heap: inserted 7 3 9 1 5 2 8 4 6 0');
  console.log(`  Peek (min): ${minHeap.peek()}`);
  console.log(`  Sorted: ${minHeap.toSortedArray().join(' → ')}`);

  const maxHeap = BinaryHeap.max();
  [7, 3, 9, 1, 5].forEach((v) => maxHeap.insert(v));
  console.log('\nMax-Heap: inserted 7 3 9 1 5');
  console.log(`  Peek (max): ${maxHeap.peek()}`);
  console.log(`  Sorted (desc): ${maxHeap.toSortedArray().join(' → ')}`);

  console.log('\nBuild from array (Floyd O(n)):');
  const h = BinaryHeap.fromArray([10, 5, 15, 3, 7, 12, 20]);
  console.log(`  Extract order: ${h.toSortedArray().join(' → ')}`);

  console.log('\nupdateKey demo:');
  const h2 = BinaryHeap.fromArray([1, 5, 3, 8, 9]);
  h2.updateKey(9, 0);
  console.log(`  After updateKey(9 → 0), peek: ${h2.peek()}`);

  console.log('\n=== PriorityQueue Demo ===\n');
  const pq = new PriorityQueue();
  pq.enqueue('Write tests', 3).enqueue('Fix critical bug', 1)
    .enqueue('Refactor code', 4).enqueue('Review PR', 2);
  console.log('Task queue (priority order):');
  while (!pq.isEmpty()) {
    const p = pq.frontPriority();
    console.log(`  [P${p}] ${pq.dequeue()}`);
  }
}

const [, , cmd, ...rest] = process.argv;
if (!cmd || cmd === '-h' || cmd === '--help') { usage(); process.exit(0); }

const nums = rest.map(Number).filter((n) => !Number.isNaN(n));

switch (cmd) {
  case 'demo': case 'pq': demo(); break;
  case 'sort':
    if (!nums.length) { console.error('Provide numbers'); process.exit(1); }
    console.log(BinaryHeap.fromArray(nums).toSortedArray().join(' '));
    break;
  case 'sort-max':
    if (!nums.length) { console.error('Provide numbers'); process.exit(1); }
    console.log(BinaryHeap.fromArray(nums, (a, b) => b - a).toSortedArray().join(' '));
    break;
  case 'topk': {
    if (nums.length < 2) { console.error('Usage: heap-x topk <k> <n1> ...'); process.exit(1); }
    const [k, ...vals] = nums;
    const heap = new BinaryHeap();
    for (const n of vals) {
      if (heap.size < k) heap.insert(n);
      else if (n > heap.peek()) { heap.extract(); heap.insert(n); }
    }
    console.log(`Top-${k}: ${heap.toSortedArray().reverse().join(' ')}`);
    break;
  }
  default: console.error(`Unknown: ${cmd}`); usage(); process.exit(1);
}
