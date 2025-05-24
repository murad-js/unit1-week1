export class Basket {
  #priceLimit = 0;
  #currentPrice = 0;
  #errors = [];
  #items = [];

  constructor({ limit = 0 }) {
    this.#priceLimit = limit;
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

  toPromise() {
    return new Promise((resolve) => {
      resolve({
        items: this.#items,
        total: this.#currentPrice,
        errors: this.#errors,
      });
    });
  }
}
