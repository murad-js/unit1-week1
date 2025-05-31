export class Basket {
  #priceLimit = 0;
  #currentPrice = 0;
  #errors = [];
  #items = [];
  #resolve = null;
  #reject = null;
  #promise = null;

  constructor({ limit = 0 }) {
    this.#priceLimit = limit;

    this.#promise = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }

  add(item) {
    const newPrice = this.#currentPrice + item.price;

    if (newPrice > this.#priceLimit) {
      this.#errors.push({ item, cause: "Not enough funds" });
    } else {
      this.#items.push(item);
      this.#currentPrice = newPrice;
    }

    return { availableFunds: this.#priceLimit - this.#currentPrice };
  }

  done() {
    this.#resolve(this.toObject());
  }

  then(onFulfilled, onRejected) {
    return this.#promise.then(onFulfilled, onRejected);
  }

  toObject() {
    if (this.sss) this.#reject(new Error("Basket is not done"));

    return {
      items: this.#items,
      total: this.#currentPrice,
      errors: this.#errors,
    };
  }
}
