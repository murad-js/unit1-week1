"use strict";

import fs from "node:fs";
import { Alignment, ColumnConfig } from "./shared.js";

class City {
  name;
  #population;
  #area;
  #density;
  #country;
  #percentage;

  constructor(cityData) {
    this.name = cityData.city;
    this.#population = cityData.population;
    this.#area = cityData.area;
    this.#density = Number(cityData.density);
    this.#country = cityData.country;
  }

  calculatePercentage(maxDensity) {
    this.#percentage = Math.round((this.#density * 100) / maxDensity);
  }

  get density() {
    return this.#density;
  }

  get percentage() {
    return this.#percentage;
  }

  toObject() {
    return {
      city: this.name,
      population: this.#population,
      area: this.#area,
      density: String(this.#density),
      country: this.#country,
      percentage: String(this.#percentage),
    };
  }
}

class CityCollection {
  #cities = [];

  add(cityData) {
    const city = new City(cityData);
    this.#cities.push(city);
  }

  processDensityPercentages() {
    const maxDensity = Math.max(...this.#cities.map((city) => city.density));
    this.#cities.forEach((city) => city.calculatePercentage(maxDensity));
    return this;
  }

  sortByPercentage() {
    this.#cities.sort((a, b) => b.percentage - a.percentage);
    return this;
  }

  [Symbol.iterator]() {
    return this.#cities.map((city) => city.toObject())[Symbol.iterator]();
  }
}

class FileReader {
  #fileName;
  #encoding;

  constructor(fileName, encoding = "utf-8") {
    this.#fileName = fileName;
    this.#encoding = encoding;
  }

  read() {
    try {
      return fs.readFileSync(this.#fileName, { encoding: this.#encoding });
    } catch (error) {
      throw new Error(
        `Failed to read file ${this.#fileName}: ${error.message}`
      );
    }
  }
}

class CsvParser {
  #headers;
  #body;
  #originalData;

  constructor(data) {
    this.#originalData = data;
    this.#headers = this.#defineHeaders();
    this.#body = this.#defineBody();
  }

  #defineHeaders() {
    return this.#originalData.split("\n")[0].split(",");
  }

  #defineBody() {
    return this.#originalData.split("\n").slice(1);
  }

  parse() {
    return this.#body.map((line) => {
      const values = line.split(",");

      if (values.length !== this.#headers.length) {
        throw new Error("Invalid CSV format: inconsistent column count");
      }

      return this.#headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index].trim();
        return obj;
      }, {});
    });
  }
}

class CityTable {
  #cityCollection;
  #rows = [];

  constructor(cityCollection) {
    this.#cityCollection = cityCollection;
  }

  build() {
    this.#rows = [];

    for (const cityData of this.#cityCollection) {
      const row = this.#buildRow(cityData);
      this.#rows.push(row);
    }
    return this;
  }

  #buildRow(cityData) {
    const cells = [];
    for (const [property, value] of Object.entries(cityData)) {
      const config = ColumnConfig[property];
      const cell = this.#buildCell(value, config);
      cells.push(cell);
    }
    return cells.join("");
  }

  #buildCell(value, config) {
    return config.align === Alignment.START
      ? value.padStart(config.width)
      : value.padEnd(config.width);
  }

  get rows() {
    return this.#rows;
  }
}

class TableDisplay {
  #table;

  constructor(table) {
    this.#table = table;
  }

  toConsole() {
    this.#table.rows.forEach((row) => console.log(row));
  }
}

function main() {
  const fileData = new FileReader("data.csv").read();
  const parsedData = new CsvParser(fileData).parse();
  const cityCollection = new CityCollection();

  parsedData.forEach((cityData) => cityCollection.add(cityData));
  cityCollection.processDensityPercentages().sortByPercentage();

  const table = new CityTable(cityCollection).build();
  const display = new TableDisplay(table);

  display.toConsole();
}

main();
