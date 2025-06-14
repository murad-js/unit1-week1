# Async Iterator and Thenable Task

## Task Description

The task involves implementing a shopping basket system with async iteration and Promise-like behavior.

### Learning Objectives

- Watch week 2 lectures about:
  - Async Iterators
  - Symbol.asyncIterator
  - Thenable objects
  - Promise-like behavior

### Implementation Goals

- Create an async iterator for a dataset
- Implement a Basket class with spending limit
- Use async iteration to process items
- Make the Basket "thenable"
- Track items, total cost, and errors

## Initial Code

```javascript
"use strict";

// Create Iterator for given dataset with Symbol.asyncIterator
// Use for..of to iterate it and pass data to Basket
// Basket is limited to certain amount
// After iteration ended Basket should return Thenable
// to notify us with final list of items, total and
// escalated errors

const purchase = [
  { name: "Laptop", price: 1500 },
  { name: "Mouse", price: 25 },
  { name: "Keyboard", price: 100 },
  { name: "HDMI cable", price: 10 },
  { name: "Bag", price: 50 },
  { name: "Mouse pad", price: 5 },
];

const main = async () => {
  const goods = PurchaseIterator.create(purchase);
  const basket = new Basket({ limit: 1050 }, (items, total) => {
    console.log(total);
  });
  // Hint: call async function without await
  for await (const item of goods) {
    basket.add(item);
  }
  // Hint: Add backet.end();
};

main();
```

## Implementation Notes

The code implements a shopping basket system that:

1. Uses `Symbol.asyncIterator` to create an async iterator
2. Processes items asynchronously with `for await...of`
3. Enforces a spending limit on the basket
4. Makes the basket "thenable" for final results
5. Tracks items, total cost, and errors

The implementation focuses on:

- Proper async iteration
- Promise-like behavior
- State management
- Error handling
- Clean separation of concerns

## Solution Components

1. **PurchaseIterator**

   - Implements `Symbol.asyncIterator`
   - Provides async iteration over purchase items
   - Handles data encapsulation

2. **Basket**

   - Enforces spending limit
   - Tracks items and total cost
   - Implements Promise-like behavior
   - Records errors for exceeded limits

3. **Main Application Flow**
   - Creates iterator and basket
   - Processes items asynchronously
   - Handles final results through Promise-like interface

## Usage Example

```javascript
const main = async () => {
  const goods = PurchaseIterator.create(purchase);
  const basket = new Basket({ limit: 1050 });

  displayBasket(basket);

  for await (const item of goods) {
    const { availableFunds } = basket.add(item);
    if (availableFunds === 0) break;
  }

  basket.done();
};

async function displayBasket(basket) {
  await basket.then(console.log, console.error);
}
```
