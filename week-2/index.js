"use strict";

import { PurchaseIterator } from "./PurchaseIterator.js";
import { Basket } from "./Basket.js";

const purchase = [
  { name: 'Laptop',  price: 1500 },
  { name: 'Mouse',  price: 25 },
  { name: 'Keyboard',  price: 100 },
  { name: 'HDMI cable',  price: 10 },
  { name: 'Bag', price: 50 },
  { name: 'Mouse pad', price: 5 },
];

const main = async () => {
  const goods = PurchaseIterator.create(purchase);
  const basket = new Basket({ limit: 1050 });

  setImmediate(() => {
    basket.toPromise().then(console.log);
  });

  for await (const item of goods) {
    const { availableFunds } = basket.add(item);

    if (availableFunds === 0) break;
  }
};

void main();
