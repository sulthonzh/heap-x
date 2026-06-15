import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BinaryHeap, PriorityQueue } from '../src/index.js';

test('min-heap insert and extract in order', () => {
  const h = new BinaryHeap();
  h.insert(5).insert(2).insert(8).insert(1).insert(9).insert(3);
  assert.strictEqual(h.extract(), 1);
  assert.strictEqual(h.extract(), 2);
  assert.strictEqual(h.extract(), 3);
  assert.strictEqual(h.extract(), 5);
  assert.strictEqual(h.extract(), 8);
  assert.strictEqual(h.extract(), 9);
  assert.strictEqual(h.extract(), undefined);
});

test('max-heap factory', () => {
  const h = BinaryHeap.max();
  [4, 1, 7, 3, 9, 2].forEach((v) => h.insert(v));
  assert.strictEqual(h.extract(), 9);
  assert.strictEqual(h.extract(), 7);
  assert.strictEqual(h.extract(), 4);
});

test('min factory', () => {
  const h = BinaryHeap.min();
  [10, 3, 7].forEach((v) => h.insert(v));
  assert.strictEqual(h.peek(), 3);
});

test('peek does not remove', () => {
  const h = BinaryHeap.fromArray([5, 3, 8, 1, 2]);
  assert.strictEqual(h.peek(), 1);
  assert.strictEqual(h.size, 5);
  assert.strictEqual(h.peek(), 1);
});

test('isEmpty and size', () => {
  const h = new BinaryHeap();
  assert.ok(h.isEmpty());
  assert.strictEqual(h.size, 0);
  h.insert(1);
  assert.ok(!h.isEmpty());
  assert.strictEqual(h.size, 1);
  h.extract();
  assert.ok(h.isEmpty());
});

test('push and pop aliases', () => {
  const h = new BinaryHeap();
  h.push(3).push(1).push(2);
  assert.strictEqual(h.pop(), 1);
  assert.strictEqual(h.pop(), 2);
});

test('chaining insert', () => {
  const h = new BinaryHeap();
  h.insert(10).insert(5).insert(15);
  assert.strictEqual(h.size, 3);
});

test('fromArray builds valid heap', () => {
  const h = BinaryHeap.fromArray([9, 7, 5, 3, 1, 0]);
  assert.strictEqual(h.peek(), 0);
  assert.strictEqual(h.extract(), 0);
  assert.strictEqual(h.extract(), 1);
  assert.strictEqual(h.extract(), 3);
});

test('fromArray with custom comparator (max-heap)', () => {
  const h = BinaryHeap.fromArray([1, 5, 2, 8, 3], (a, b) => b - a);
  assert.strictEqual(h.extract(), 8);
  assert.strictEqual(h.extract(), 5);
  assert.strictEqual(h.extract(), 3);
});

test('from iterable', () => {
  const h = BinaryHeap.from(new Set([5, 3, 9, 1, 7]));
  assert.strictEqual(h.extract(), 1);
  assert.strictEqual(h.extract(), 3);
  assert.strictEqual(h.extract(), 5);
  assert.strictEqual(h.extract(), 7);
  assert.strictEqual(h.extract(), 9);
});

test('fromArray empty', () => {
  const h = BinaryHeap.fromArray([]);
  assert.ok(h.isEmpty());
});

test('fromArray single element', () => {
  const h = BinaryHeap.fromArray([42]);
  assert.strictEqual(h.peek(), 42);
  assert.strictEqual(h.size, 1);
});

test('heap with objects', () => {
  const h = new BinaryHeap((a, b) => a.age - b.age);
  h.insert({ name: 'Alice', age: 30 });
  h.insert({ name: 'Bob', age: 25 });
  h.insert({ name: 'Carol', age: 35 });
  assert.strictEqual(h.extract().name, 'Bob');
  assert.strictEqual(h.extract().name, 'Alice');
  assert.strictEqual(h.extract().name, 'Carol');
});

test('heap with strings', () => {
  const h = new BinaryHeap((a, b) => a.localeCompare(b));
  h.insert('cherry').insert('apple').insert('banana');
  assert.strictEqual(h.extract(), 'apple');
  assert.strictEqual(h.extract(), 'banana');
  assert.strictEqual(h.extract(), 'cherry');
});

test('remove specific value', () => {
  const h = BinaryHeap.fromArray([5, 3, 8, 1, 9, 2]);
  assert.ok(h.remove(3));
  assert.ok(!h.has(3));
  assert.strictEqual(h.size, 5);
  const sorted = h.toSortedArray();
  for (let i = 1; i < sorted.length; i++) assert.ok(sorted[i - 1] <= sorted[i]);
});

test('remove non-existent value', () => {
  const h = BinaryHeap.fromArray([1, 2, 3]);
  assert.ok(!h.remove(99));
  assert.strictEqual(h.size, 3);
});

test('remove root', () => {
  const h = BinaryHeap.fromArray([1, 2, 3, 4, 5]);
  assert.ok(h.remove(1));
  assert.strictEqual(h.peek(), 2);
});

test('remove last element', () => {
  const h = BinaryHeap.fromArray([1, 2, 3]);
  assert.ok(h.remove(3));
  assert.strictEqual(h.size, 2);
});

test('updateKey decrease (sift up)', () => {
  const h = BinaryHeap.fromArray([5, 3, 8, 1, 9, 2, 7]);
  h.updateKey(9, 0);
  assert.strictEqual(h.peek(), 0);
});

test('updateKey increase (sift down)', () => {
  const h = BinaryHeap.fromArray([1, 5, 3]);
  h.updateKey(1, 10);
  assert.strictEqual(h.peek(), 3);
});

test('updateKey not found', () => {
  const h = BinaryHeap.fromArray([1, 2, 3]);
  assert.ok(!h.updateKey(99, 0));
});

test('merge two heaps', () => {
  const a = BinaryHeap.fromArray([1, 5, 3]);
  const b = BinaryHeap.fromArray([2, 4, 0]);
  a.merge(b);
  assert.strictEqual(a.size, 6);
  assert.strictEqual(a.extract(), 0);
  assert.strictEqual(a.extract(), 1);
  assert.strictEqual(a.extract(), 2);
  assert.strictEqual(a.extract(), 3);
  assert.strictEqual(a.extract(), 4);
  assert.strictEqual(a.extract(), 5);
  assert.strictEqual(b.size, 3);
});

test('toSortedArray does not modify heap', () => {
  const h = BinaryHeap.fromArray([5, 3, 8, 1, 2]);
  assert.deepStrictEqual(h.toSortedArray(), [1, 2, 3, 5, 8]);
  assert.strictEqual(h.size, 5);
  assert.strictEqual(h.peek(), 1);
});

test('toSortedArray on max-heap', () => {
  const h = BinaryHeap.fromArray([1, 5, 2, 8, 3], (a, b) => b - a);
  assert.deepStrictEqual(h.toSortedArray(), [8, 5, 3, 2, 1]);
});

test('toSortedArray empty', () => {
  const h = new BinaryHeap();
  assert.deepStrictEqual(h.toSortedArray(), []);
});

test('has', () => {
  const h = BinaryHeap.fromArray([1, 5, 3, 8]);
  assert.ok(h.has(3));
  assert.ok(h.has(8));
  assert.ok(!h.has(99));
});

test('clear', () => {
  const h = BinaryHeap.fromArray([1, 2, 3]);
  h.clear();
  assert.ok(h.isEmpty());
  assert.strictEqual(h.size, 0);
});

test('toJSON and fromJSON round-trip', () => {
  const h = BinaryHeap.fromArray([5, 3, 8, 1, 2, 9, 4]);
  const json = h.toJSON();
  const h2 = BinaryHeap.fromJSON(json);
  assert.strictEqual(h2.size, 7);
  assert.strictEqual(h2.extract(), 1);
  assert.strictEqual(h2.extract(), 2);
  assert.strictEqual(h2.extract(), 3);
});

test('toArray returns copy', () => {
  const h = BinaryHeap.fromArray([3, 1, 2]);
  const arr = h.toArray();
  assert.strictEqual(arr.length, 3);
  arr[0] = 999;
  assert.strictEqual(h.size, 3);
});

test('iterator extracts in order (destructive)', () => {
  const h = BinaryHeap.fromArray([5, 1, 3, 2, 4]);
  assert.deepStrictEqual([...h], [1, 2, 3, 4, 5]);
  assert.ok(h.isEmpty());
});

test('extract on empty heap', () => {
  const h = new BinaryHeap();
  assert.strictEqual(h.extract(), undefined);
});

test('negative numbers', () => {
  const h = BinaryHeap.fromArray([-5, 3, -1, 0, -10]);
  assert.strictEqual(h.extract(), -10);
  assert.strictEqual(h.extract(), -5);
  assert.strictEqual(h.extract(), -1);
  assert.strictEqual(h.extract(), 0);
  assert.strictEqual(h.extract(), 3);
});

test('duplicate values', () => {
  const h = BinaryHeap.fromArray([3, 1, 3, 1, 3]);
  assert.strictEqual(h.extract(), 1);
  assert.strictEqual(h.extract(), 1);
  assert.strictEqual(h.extract(), 3);
  assert.strictEqual(h.extract(), 3);
  assert.strictEqual(h.extract(), 3);
});

test('large heap maintains order', () => {
  const n = 10000;
  const arr = [];
  for (let i = 0; i < n; i++) arr.push(Math.floor(Math.random() * 100000));
  const h = BinaryHeap.fromArray(arr);
  let prev = -Infinity, count = 0;
  while (!h.isEmpty()) {
    const v = h.extract();
    assert.ok(v >= prev);
    prev = v;
    count++;
  }
  assert.strictEqual(count, n);
});

// PriorityQueue tests
test('PriorityQueue basic operations', () => {
  const pq = new PriorityQueue();
  pq.enqueue('task-low', 10);
  pq.enqueue('task-high', 1);
  pq.enqueue('task-mid', 5);
  assert.strictEqual(pq.dequeue(), 'task-high');
  assert.strictEqual(pq.dequeue(), 'task-mid');
  assert.strictEqual(pq.dequeue(), 'task-low');
  assert.strictEqual(pq.dequeue(), undefined);
});

test('PriorityQueue front and frontPriority', () => {
  const pq = new PriorityQueue();
  pq.enqueue('a', 3).enqueue('b', 1);
  assert.strictEqual(pq.front(), 'b');
  assert.strictEqual(pq.frontPriority(), 1);
});

test('PriorityQueue max order', () => {
  const pq = new PriorityQueue({ order: 'max' });
  pq.enqueue('low', 1).enqueue('high', 10).enqueue('mid', 5);
  assert.strictEqual(pq.dequeue(), 'high');
  assert.strictEqual(pq.dequeue(), 'mid');
  assert.strictEqual(pq.dequeue(), 'low');
});

test('PriorityQueue size and isEmpty', () => {
  const pq = new PriorityQueue();
  assert.ok(pq.isEmpty());
  pq.enqueue('x', 1);
  assert.strictEqual(pq.size, 1);
  assert.ok(!pq.isEmpty());
});

test('PriorityQueue clear', () => {
  const pq = new PriorityQueue();
  pq.enqueue('a', 1).enqueue('b', 2);
  pq.clear();
  assert.ok(pq.isEmpty());
});

test('PriorityQueue toSortedArray', () => {
  const pq = new PriorityQueue();
  pq.enqueue('c', 3).enqueue('a', 1).enqueue('b', 2);
  assert.deepStrictEqual(pq.toSortedArray(), ['a', 'b', 'c']);
});

test('PriorityQueue with objects', () => {
  const pq = new PriorityQueue();
  pq.enqueue({ id: 1 }, 5).enqueue({ id: 2 }, 1).enqueue({ id: 3 }, 3);
  assert.strictEqual(pq.dequeue().id, 2);
  assert.strictEqual(pq.dequeue().id, 3);
  assert.strictEqual(pq.dequeue().id, 1);
});
