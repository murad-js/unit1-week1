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
      next: async () => {
        return new Promise((resolve) => {
          resolve({ value: goods[i++], done: i > goods.length });
        });
      },
    };
  }
}
