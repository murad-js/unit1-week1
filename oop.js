"use strict";

import fs from "node:fs";

class City {
  #percentage = 0;

  constructor(city, population, area, density, country) {
    this.city = city;
    this.population = population;
    this.area = area;
    this.density = density;
    this.country = country;
  }

  get percentage() {
    return this.#percentage;
  }

  calculatePercentage(maxDensity) {
    this.#percentage = ((this.density / maxDensity) * 100).toFixed(2);
  }
}

class DataSource {
  static load(fileName) {
    try {
      const data = fs.readFileSync(fileName, { encoding: "utf-8" });
      return new DataParser(data);
    } catch (error) {
      console.error("Error loading data:", error);
      return null;
    }
  }
}

class DataParser {
  #rawData;
  #parsedData;

  constructor(rawData) {
    this.#rawData = rawData;
    this.#parsedData = this.#parse();
  }

  #parse() {
    const lines = this.#rawData.split("\n");
    const properties = lines.shift().split(",");

    return lines.map((line) => {
      const values = line.split(",");
      if (values.length !== properties.length) {
        throw new Error("Invalid data format");
      }

      return properties.reduce((acc, property, index) => {
        acc[property] = values[index];
        return acc;
      }, {});
    });
  }

  get data() {
    return this.#parsedData;
  }
}

class CityCollection {
  #cities = [];
  #maxDensity = 0;

  constructor(parsedData) {
    this.#buildCities(parsedData);
  }

  #buildCities(parsedData) {
    this.#maxDensity = Math.max(...parsedData.map((city) => city.density));

    this.#cities = parsedData.map((cityData) => {
      const city = new City(
        cityData.city,
        cityData.population,
        cityData.area,
        cityData.density,
        cityData.country
      );
      city.calculatePercentage(this.#maxDensity);
      return city;
    });
  }

  sortCities() {
    this.#cities.sort((a, b) => b.percentage - a.percentage);

    return this;
  }

  get cities() {
    return this.#cities;
  }
}

class TableFormatter {
  static #COLUMN_WIDTH = Object.freeze({
    CITY: 18,
    POPULATION: 10,
    AREA: 8,
    DENSITY: 8,
    COUNTRY: 18,
    PERCENTAGE: 6,
  });

  static #truncate(str, maxLength) {
    return str.length <= maxLength ? str : str.slice(0, maxLength - 3) + "...";
  }

  static format(cities) {
    return cities.map((city) => this.#formatRow(city)).join("\n");
  }

  static #formatRow(city) {
    return [
      this.#truncate(city.city, this.#COLUMN_WIDTH.CITY).padEnd(
        this.#COLUMN_WIDTH.CITY
      ),
      this.#truncate(city.population, this.#COLUMN_WIDTH.POPULATION).padStart(
        this.#COLUMN_WIDTH.POPULATION
      ),
      this.#truncate(city.area, this.#COLUMN_WIDTH.AREA).padStart(
        this.#COLUMN_WIDTH.AREA
      ),
      this.#truncate(city.density, this.#COLUMN_WIDTH.DENSITY).padStart(
        this.#COLUMN_WIDTH.DENSITY
      ),
      this.#truncate(city.country, this.#COLUMN_WIDTH.COUNTRY).padStart(
        this.#COLUMN_WIDTH.COUNTRY
      ),
      this.#truncate(city.percentage, this.#COLUMN_WIDTH.PERCENTAGE).padStart(
        this.#COLUMN_WIDTH.PERCENTAGE
      ),
    ].join("");
  }
}

function main() {
  const parser = DataSource.load("data.csv");

  if (!parser) {
    return;
  }

  const cityCollection = new CityCollection(parser.data);
  const formattedTable = TableFormatter.format(
    cityCollection.sortCities().cities
  );
  console.log(formattedTable);
}

main();
