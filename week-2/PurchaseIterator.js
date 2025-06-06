import { Thenable } from "./Thenable.js";

export class PurchaseIterator {
  #goods;

  constructor(goods) {
    this.#goods = structuredClone(goods);
  }

  static create(goods) {
    return new PurchaseIterator(goods);
  }

  [Symbol.asyncIterator]() {
    const goods = this.#goods;
    let i = 0;

    return {
      next: () => {
        return new Thenable((resolve) => {
          resolve({ value: goods[i++], done: i > goods.length });
        });
      },
    };
  }
}
