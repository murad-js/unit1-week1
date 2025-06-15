'use strict';

class Pool {
  #factory = null;
  #instances = [];
  #max = 0;
  #queue = [];
  #totalInstancesCount = 0;

  constructor(factory, { size, max }) {
    this.#max = max;
    this.#factory = factory;

    this.#instances = new Array(size).fill(null).map(factory);
    this.#totalInstancesCount = size;
  }

  acquire(cb) {
    if (this.#instances.length > 0) {
      const instance = this.#instances.pop();
      process.nextTick(() => cb(instance));

      return;
    }

    if (this.#totalInstancesCount < this.#max) {
      const instance = this.#factory();
      this.#totalInstancesCount++;
      process.nextTick(() => cb(instance));

      return;
    }

    this.#queue.push(cb);
  }

  release(instance) {
    if (this.#queue.length > 0) {
      const cb = this.#queue.shift();
      process.nextTick(() => cb(instance));

      return;
    }

    this.#instances.push(instance);
  }
}

// Usage
const createBuffer = (size) => new Uint8Array(size);

const FILE_BUFFER_SIZE = 4096;
const createFileBuffer = () => createBuffer(FILE_BUFFER_SIZE);

const pool = new Pool(createFileBuffer, { size: 5, max: 7 });

for (let i = 0; i < 12; i++) {
  pool.acquire((instance) => {
    setTimeout(() => {
      // Do something.
      console.log(i, instance.constructor.name);

      if (i < 2) pool.release(instance);
    }, 1000);
  });
}
