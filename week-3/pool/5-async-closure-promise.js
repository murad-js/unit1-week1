'use strict';

const poolify = (factory, { size, max }) => {
  const instances = new Array(size).fill(null).map(factory);
  const queue = [];
  let totalInstancesCount = size;

  const acquire = () => {
    return new Promise((resolve) => {
      if (instances.length > 0) {
        const instance = instances.pop();
        resolve(instance);

        return;
      }

      if (totalInstancesCount < max) {
        const instance = factory();
        totalInstancesCount++;
        resolve(instance);

        return;
      }

      queue.push(resolve);
    });
  };

  const release = (instance) => {
    if (queue.length > 0) {
      const resolve = queue.shift();
      resolve(instance);

      return;
    }

    instances.push(instance);
  };

  return { acquire, release };
};

// Usage

const createBuffer = (size) => new Uint8Array(size);

const FILE_BUFFER_SIZE = 4096;
const createFileBuffer = () => createBuffer(FILE_BUFFER_SIZE);

const pool = poolify(createFileBuffer, { size: 5, max: 7 });

for (let i = 0; i < 12; i++) {
  pool.acquire().then((instance) => {
    setTimeout(() => {
      // Do something.
      console.log(i, instance.constructor.name);

      if (i < 2) pool.release(instance);
    }, 1000);

    return instance;
  });
}
