# Code Refactoring Task

## Task Description

The task involves rewriting and optimizing the following code while applying various software engineering principles and best practices.

### Learning Objectives
- Watch week 1 lectures about:
  - Separation of Concerns (SoC)
  - Single Responsibility Principle (SRP)
  - Code characteristics
  - V8 engine

### Optimization Goals
- Apply optimizations of computing resources:
  - Processor optimization
  - Memory optimization
- Minimize cognitive complexity
- Respect SRP and SoC
- Improve:
  - Readability (understanding)
  - Reliability
  - Maintainability
  - Reusability
  - Flexibility
- Make code testable
- Implement simple unit tests without frameworks

### Additional Tasks
- Implement in multiple paradigms:
  - Object-Oriented Programming (OOP)
  - Functional Programming (FP)
  - Procedural Programming
  - Mixed approaches
- Prepare load testing and trace V8 deoptimizations

## Initial Code

```javascript
'use strict';

const data = `city,population,area,density,country
  Shanghai,24256800,6340,3826,China
  Delhi,16787941,1484,11313,India
  Lagos,16060303,1171,13712,Nigeria
  Istanbul,14160467,5461,2593,Turkey
  Tokyo,13513734,2191,6168,Japan
  Sao Paulo,12038175,1521,7914,Brazil
  Mexico City,8874724,1486,5974,Mexico
  London,8673713,1572,5431,United Kingdom
  New York City,8537673,784,10892,United States
  Bangkok,8280925,1569,5279,Thailand`;

if (data) {
  const lines = data.split('\n');
  lines.pop();
  const table = [];
  let first = true;
  let max = 0;
  for (const line of lines) {
    if (first) {
      first = false;
    } else {
      const cells = line.split(',');
      const d = parseInt(cells[3]);
      if (d > max) max = d;
      table.push([cells[0], cells[1], cells[2], cells[3], cells[4]]);
    }
  }
  for (const row of table) {
    const a = Math.round((row[3] * 100) / max);
    row.push(a.toString());
  }
  table.sort((r1, r2) => r2[5] - r1[5]);
  for (const row of table) {
    let s = row[0].padEnd(18);
    s += row[1].padStart(10);
    s += row[2].padStart(8);
    s += row[3].padStart(8);
    s += row[4].padStart(18);
    s += row[5].padStart(6);
    console.log(s);
  }
}
```

## Implementation Notes

The code processes city data to:
1. Calculate population density percentages
2. Sort cities by density percentage
3. Format and display the data in a table

The refactoring should focus on:
- Breaking down the monolithic code into smaller, focused components
- Improving error handling and data validation
- Making the code more maintainable and testable
- Optimizing performance
- Following best practices for the chosen programming paradigm
