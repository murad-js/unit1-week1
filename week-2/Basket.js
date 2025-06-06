import { Thenable } from "./Thenable.js";

export class Basket {
  #priceLimit = 0;
  #currentPrice = 0;
  #errors = [];
  #items = [];
  #promise = null;
  #resolve = null;

  constructor({ limit = 0 }) {
    this.#priceLimit = limit;

    this.#promise = new Thenable((resolve) => {
      this.#resolve = resolve;
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

  toPromise() {
    return this.#promise;
  }

  toObject() {
    return {
      items: this.#items,
      total: this.#currentPrice,
      errors: this.#errors,
    };
  }
}
