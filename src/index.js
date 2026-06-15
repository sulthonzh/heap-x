'use strict';

class BinaryHeap {
  constructor(comparator) {
    this._data = [];
    this._cmp = comparator || ((a, b) => a - b);
  }

  static min() {
    return new BinaryHeap((a, b) => a - b);
  }

  static max() {
    return new BinaryHeap((a, b) => b - a);
  }

  static fromArray(arr, comparator) {
    const heap = new BinaryHeap(comparator);
    heap._data = arr.slice();
    for (let i = (heap._data.length >>> 1) - 1; i >= 0; i--) {
      heap._siftDown(i);
    }
    return heap;
  }

  static from(iterable, comparator) {
    return BinaryHeap.fromArray([...iterable], comparator);
  }

  static fromJSON(json) {
    return BinaryHeap.fromArray(json.data || []);
  }

  insert(value) {
    this._data.push(value);
    this._siftUp(this._data.length - 1);
    return this;
  }

  push(value) {
    return this.insert(value);
  }

  peek() {
    return this._data[0];
  }

  extract() {
    if (this._data.length === 0) return undefined;
    const top = this._data[0];
    const last = this._data.pop();
    if (this._data.length > 0) {
      this._data[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  pop() {
    return this.extract();
  }

  remove(value) {
    const idx = this._data.indexOf(value);
    if (idx === -1) return false;
    this._removeAt(idx);
    return true;
  }

  updateKey(oldValue, newValue) {
    const idx = this._data.indexOf(oldValue);
    if (idx === -1) return false;
    this._data[idx] = newValue;
    if (idx > 0) {
      const parentIdx = (idx - 1) >>> 1;
      if (this._cmp(this._data[idx], this._data[parentIdx]) < 0) {
        this._siftUp(idx);
        return true;
      }
    }
    this._siftDown(idx);
    return true;
  }

  merge(other) {
    this._data = this._data.concat(other._data);
    for (let i = (this._data.length >>> 1) - 1; i >= 0; i--) {
      this._siftDown(i);
    }
    return this;
  }

  get size() {
    return this._data.length;
  }

  isEmpty() {
    return this._data.length === 0;
  }

  has(value) {
    return this._data.indexOf(value) !== -1;
  }

  toSortedArray() {
    const copy = BinaryHeap.fromArray(this._data, this._cmp);
    const result = [];
    while (!copy.isEmpty()) result.push(copy.extract());
    return result;
  }

  toArray() {
    return this._data.slice();
  }

  toJSON() {
    return { data: this._data.slice() };
  }

  clear() {
    this._data = [];
  }

  *[Symbol.iterator]() {
    while (!this.isEmpty()) yield this.extract();
  }

  _siftUp(idx) {
    const data = this._data;
    const cmp = this._cmp;
    const item = data[idx];
    while (idx > 0) {
      const parentIdx = (idx - 1) >>> 1;
      const parent = data[parentIdx];
      if (cmp(item, parent) >= 0) break;
      data[idx] = parent;
      idx = parentIdx;
    }
    data[idx] = item;
  }

  _siftDown(idx) {
    const data = this._data;
    const cmp = this._cmp;
    const n = data.length;
    const item = data[idx];
    const half = n >>> 1;
    while (idx < half) {
      let childIdx = (idx << 1) + 1;
      const right = childIdx + 1;
      if (right < n && cmp(data[right], data[childIdx]) < 0) childIdx = right;
      if (cmp(item, data[childIdx]) <= 0) break;
      data[idx] = data[childIdx];
      idx = childIdx;
    }
    data[idx] = item;
  }

  _removeAt(idx) {
    const last = this._data.pop();
    if (idx === this._data.length) return;
    this._data[idx] = last;
    if (idx > 0) {
      const parentIdx = (idx - 1) >>> 1;
      if (this._cmp(this._data[idx], this._data[parentIdx]) < 0) {
        this._siftUp(idx);
        return;
      }
    }
    this._siftDown(idx);
  }
}

class PriorityQueue {
  constructor(options = {}) {
    const asc = options.order !== 'max';
    this._heap = new BinaryHeap((a, b) =>
      asc ? a.priority - b.priority : b.priority - a.priority
    );
  }

  enqueue(value, priority) {
    this._heap.insert({ priority, value });
    return this;
  }

  dequeue() {
    const node = this._heap.extract();
    return node ? node.value : undefined;
  }

  front() {
    const node = this._heap.peek();
    return node ? node.value : undefined;
  }

  frontPriority() {
    const node = this._heap.peek();
    return node ? node.priority : undefined;
  }

  get size() {
    return this._heap.size;
  }

  isEmpty() {
    return this._heap.isEmpty();
  }

  clear() {
    this._heap.clear();
  }

  toSortedArray() {
    return this._heap.toSortedArray().map((n) => n.value);
  }

  toJSON() {
    return { data: this._heap.toJSON().data };
  }
}

export { BinaryHeap, PriorityQueue };
