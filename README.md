# heap-x

Zero-dependency binary heap and priority queue for JavaScript/TypeScript.

Binary heaps are the backbone of priority queues, scheduling systems, and efficient sorting. `heap-x` gives you a clean, well-tested implementation with zero bloat.

## Install

```bash
npm install heap-x
```

## Quick Start

```javascript
import { BinaryHeap, PriorityQueue } from 'heap-x';

// Min-heap — smallest element on top
const heap = new BinaryHeap();
heap.insert(5).insert(2).insert(8).insert(1);
console.log(heap.extract()); // 1
console.log(heap.extract()); // 2

// Max-heap
const maxHeap = BinaryHeap.max();
maxHeap.insert(1).insert(9).insert(3);
console.log(maxHeap.extract()); // 9

// Priority Queue — tasks with priorities
const pq = new PriorityQueue();
pq.enqueue('Fix critical bug', 1);
pq.enqueue('Write tests', 3);
pq.enqueue('Review PR', 2);
console.log(pq.dequeue()); // 'Fix critical bug'
```

## API

### BinaryHeap

The core heap implementation. Min-heap by default.

#### Constructors & Factories

| Method | Description |
|--------|-------------|
| `new BinaryHeap(comparator?)` | Create heap with optional comparator |
| `BinaryHeap.min()` | Factory: min-heap (natural ordering) |
| `BinaryHeap.max()` | Factory: max-heap (reverse ordering) |
| `BinaryHeap.fromArray(arr, comparator?)` | Build heap from array in O(n) (Floyd's method) |
| `BinaryHeap.from(iterable, comparator?)` | Build heap from any iterable |
| `BinaryHeap.fromJSON(json)` | Restore from `toJSON()` output |

#### Core Operations

| Method | Time | Description |
|--------|------|-------------|
| `insert(value)` / `push(value)` | O(log n) | Add element, returns `this` for chaining |
| `extract()` / `pop()` | O(log n) | Remove and return top element |
| `peek()` | O(1) | Look at top without removing |
| `remove(value)` | O(n) | Remove specific value (first match) |
| `updateKey(old, new)` | O(n) | Update a value and re-heapify |
| `merge(other)` | O(n) | Merge another heap into this one |

#### Query & Utils

| Method | Description |
|--------|-------------|
| `size` | Element count (getter) |
| `isEmpty()` | Check if empty |
| `has(value)` | Check if value exists |
| `toSortedArray()` | Return sorted array (non-destructive, O(n log n)) |
| `toArray()` | Copy of internal storage |
| `toJSON()` / `fromJSON()` | Serialization |
| `clear()` | Remove all elements |
| `[Symbol.iterator]` | Destructive iteration in sorted order |

#### Custom Comparators

```javascript
// Object heap — youngest first
const byAge = new BinaryHeap((a, b) => a.age - b.age);
byAge.insert({ name: 'Alice', age: 30 });
byAge.insert({ name: 'Bob', age: 25 });
byAge.peek(); // { name: 'Bob', age: 25 }

// String heap — alphabetical
const words = new BinaryHeap((a, b) => a.localeCompare(b));
```

### PriorityQueue

Convenience wrapper for object-based priority queues.

```javascript
const pq = new PriorityQueue({ order: 'max' }); // default: 'min'
pq.enqueue(value, priority);
pq.dequeue();     // highest precedence value
pq.front();       // peek value
pq.frontPriority(); // peek priority
```

## Real-World Examples

### Task Scheduler

```javascript
const pq = new PriorityQueue();

// Add tasks with priority (1 = urgent, 5 = low)
pq.enqueue({ type: 'email', to: 'boss' }, 1);
pq.enqueue({ type: 'report', monthly: true }, 2);
pq.enqueue({ type: 'cleanup', temp: true }, 5);

// Process in priority order
while (!pq.isEmpty()) {
  const task = pq.dequeue();
  await processTask(task);
}
```

### Top-K Elements (Streaming)

```javascript
// Find top-5 largest numbers in a stream using a min-heap of size 5
const top5 = new BinaryHeap();

for (const value of dataStream) {
  if (top5.size < 5) {
    top5.insert(value);
  } else if (value > top5.peek()) {
    top5.extract();  // evict smallest of the top-5
    top5.insert(value);
  }
}

// top5 now contains the 5 largest values
const result = top5.toSortedArray().reverse();
```

### Dijkstra's Shortest Path

```javascript
function dijkstra(graph, start) {
  const dist = new Map();
  const heap = new BinaryHeap((a, b) => a.d - b.d);
  
  dist.set(start, 0);
  heap.insert({ node: start, d: 0 });

  while (!heap.isEmpty()) {
    const { node, d } = heap.extract();
    if (d > (dist.get(node) ?? Infinity)) continue;
    
    for (const [neighbor, weight] of graph.edges(node)) {
      const nd = d + weight;
      if (nd < (dist.get(neighbor) ?? Infinity)) {
        dist.set(neighbor, nd);
        heap.insert({ node: neighbor, d: nd });
      }
    }
  }
  return dist;
}
```

### Event Processing with Priority

```javascript
const events = new PriorityQueue({ order: 'min' });

events.enqueue({ type: 'alarm', source: 'server-1' }, 0);
events.enqueue({ type: 'webhook', source: 'stripe' }, 2);
events.enqueue({ type: 'log', source: 'app' }, 10);

// Process alarms before webhooks before logs
const handler = () => {
  while (!events.isEmpty()) {
    const event = events.dequeue();
    handleEvent(event);
  }
};
```

### Merge K Sorted Arrays

```javascript
function mergeKSorted(arrays) {
  const heap = new BinaryHeap((a, b) => a.value - b.value);
  const result = [];

  // Seed with first element of each array
  arrays.forEach((arr, i) => {
    if (arr.length > 0) {
      heap.insert({ value: arr[0], arrayIndex: i, elementIndex: 0 });
    }
  });

  while (!heap.isEmpty()) {
    const { value, arrayIndex, elementIndex } = heap.extract();
    result.push(value);
    
    const arr = arrays[arrayIndex];
    if (elementIndex + 1 < arr.length) {
      heap.insert({ 
        value: arr[elementIndex + 1], 
        arrayIndex, 
        elementIndex: elementIndex + 1 
      });
    }
  }

  return result;
}

mergeKSorted([[1, 4, 7], [2, 5, 8], [3, 6, 9]]);
// [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## CLI

```bash
# Heap sort (ascending)
npx heap-x sort 5 3 8 1 9 2 4
# Output: 1 2 3 4 5 8 9

# Heap sort (descending)
npx heap-x sort-max 5 3 8 1 9 2 4
# Output: 9 8 5 4 3 2 1

# Top-K largest
npx heap-x topk 3 9 3 7 1 8 5 2 6
# Output: Top-3: 9 8 7

# Interactive demo
npx heap-x demo
```

## Complexity

| Operation | Time | Space |
|-----------|------|-------|
| insert | O(log n) | O(1) |
| extract | O(log n) | O(1) |
| peek | O(1) | O(1) |
| fromArray (Floyd build) | O(n) | O(n) |
| merge | O(n) | O(n) |
| remove | O(n) | O(1) |
| updateKey | O(n) | O(1) |
| toSortedArray | O(n log n) | O(n) |

## Zero Dependencies

No runtime dependencies. Just pure JavaScript (ES modules).

## License

MIT
