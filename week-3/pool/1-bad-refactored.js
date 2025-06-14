'use strict';

const poolify = (factory, options, size, max) => {
  const instances = Array(size)
    .fill(null)
    .map(() => factory(options));
  let totalInstancesCount = instances.length;

  const getInstance = () => {
    if (instances.length > 0) {
      return instances.pop();
    }

    if (totalInstancesCount < max) {
      const instance = factory(options);
      totalInstancesCount++;
      return instance;
    }
  };
  const returnInstance = (instance) => {
    instances.push(instance);
  };

  return { getInstance, returnInstance };
};

// Usage

const createBuffer = ({ size }) => new Uint8Array(size);
const pool = poolify(createBuffer, { size: 4096 }, 10, 15);

const instance = pool.getInstance();
console.log({ instance });
pool.returnInstance(instance);
