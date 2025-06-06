export class Thenable {
  onFulfilledCallbacks = [];
  isDone = false;
  state = null;

  constructor(cb) {
    return cb((data) => {
      this.isDone = true;
      this.state = data;
      return this.onFulfilledCallbacks.forEach((fn) => fn(data));
    });
  }

  then(onFulfilled) {
    if (this.isDone) {
      onFulfilled(this.state);
    } else {
      this.onFulfilledCallbacks.push(onFulfilled);
    }

    return this;
  }
}
