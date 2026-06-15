export declare class BinaryHeap<T> {
  constructor(comparator?: (a: T, b: T) => number);

  static min(): BinaryHeap<number>;
  static max(): BinaryHeap<number>;
  static fromArray<T>(arr: T[], comparator?: (a: T, b: T) => number): BinaryHeap<T>;
  static from<T>(iterable: Iterable<T>, comparator?: (a: T, b: T) => number): BinaryHeap<T>;
  static fromJSON<T>(json: { data: T[] }): BinaryHeap<T>;

  insert(value: T): this;
  push(value: T): this;
  peek(): T | undefined;
  extract(): T | undefined;
  pop(): T | undefined;
  remove(value: T): boolean;
  updateKey(oldValue: T, newValue: T): boolean;
  merge(other: BinaryHeap<T>): this;

  readonly size: number;
  isEmpty(): boolean;
  has(value: T): boolean;

  toSortedArray(): T[];
  toArray(): T[];
  toJSON(): { data: T[] };
  clear(): void;

  [Symbol.iterator](): IterableIterator<T>;
}

export declare class PriorityQueue<T = any> {
  constructor(options?: { order?: 'min' | 'max' });

  enqueue(value: T, priority: number): this;
  dequeue(): T | undefined;
  front(): T | undefined;
  frontPriority(): number | undefined;

  readonly size: number;
  isEmpty(): boolean;
  clear(): void;
  toSortedArray(): T[];
  toJSON(): { data: Array<{ priority: number; value: T }> };
}
