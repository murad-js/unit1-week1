'use strict';

class Pool {
  #factory = null;
  #instances = [];
  #max = 0;
  #totalInstancesCount = 0;

  constructor(factory, { size, max }) {
    this.#max = max;
    this.#factory = factory;

    this.#instances = new Array(size).fill(null).map(factory);
    this.#totalInstancesCount = size;
  }

  acquire() {
    if (this.#instances.length > 0) {
      return this.#instances.pop();
    }

    if (this.#totalInstancesCount < max) {
      const instance = this.#factory();
      this.#totalInstancesCount++;
      return instance;
    }
  }

  release(instance) {
    this.#instances.push(instance);
  }
}

const createBuffer = (size) => new Uint8Array(size);

const FILE_BUFFER_SIZE = 4096;
const createFileBuffer = () => createBuffer(FILE_BUFFER_SIZE);

const pool = new Pool(createFileBuffer, { size: 10, max: 15 });
const instance = pool.acquire();
console.log({ instance });
pool.release(instance);
