'use strict';

const poolify = (factory, options, size, max) => {
  const instances = Array(size)
    .fill(null)
    .map(() => factory(options));

  const getInstance = () => instances.pop() || factory(options);
  const returnInstance = (instance) => {
    if (instances.length < max) {
      instances.push(instance);
    }
  };

  return { getInstance, returnInstance };
};

// Usage

const createBuffer = ({ size }) => new Uint8Array(size);
const pool = poolify(createBuffer, { size: 4096 }, 10, 15);

const instance = pool.getInstance();
console.log({ instance });
pool.returnInstance(instance);
