# Shopping Basket Implementation

This project implements a shopping basket system with an asynchronous iterator pattern and price limit functionality.

## Overview

The solution consists of three main components:

1. `PurchaseIterator` - An async iterator for processing shopping items
2. `Basket` - A price-limited shopping basket implementation
3. Main application logic that ties everything together

## Components

### PurchaseIterator

The `PurchaseIterator` class implements the async iterator pattern using `Symbol.asyncIterator`. It allows for asynchronous iteration over a collection of goods.

```javascript
const goods = PurchaseIterator.create(purchase);
```

### Basket

The `Basket` class manages a shopping cart with the following features:
- Price limit enforcement
- Item tracking
- Error handling for items that exceed the budget
- Promise-based result reporting

```javascript
const basket = new Basket({ limit: 1050 });
```

## Usage

```javascript
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
```

## Features

- **Async Iteration**: Uses `for await...of` to process items asynchronously
- **Price Limit**: Enforces a maximum spending limit
- **Error Tracking**: Records items that couldn't be added due to budget constraints
- **Promise-based Results**: Returns a promise with the final basket state

## Implementation Details

- The `PurchaseIterator` uses `Symbol.asyncIterator` to create an async iterator
- The `Basket` class maintains private state using private class fields (#)
- Results are returned as a promise containing:
  - List of successfully added items
  - Total price
  - Any errors encountered during the process

## Example Output

The basket will return an object with the following structure:
```javascript
{
  items: [...], // Successfully added items
  total: number, // Total price of added items
  errors: [...] // Items that couldn't be added due to budget constraints
}
``` 