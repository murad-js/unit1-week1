"use strict";

import fs from "node:fs";

const ColumnWidth = Object.freeze({
  CITY: 18,
  POPULATION: 10,
  AREA: 8,
  DENSITY: 8,
  COUNTRY: 18,
  PERCENTAGE: 6,
});

const main = () => {
  const data = loadDataFromFile("data.csv");

  if (!data) {
    return;
  }

  const parsedData = parseData(data);
  const maxDensity = getMaxDensity(parsedData);
  const cities = buildCitiesFromParsedData({ data: parsedData, maxDensity });

  cities.sort((a, b) => b.percentage - a.percentage);

  const table = buildTable(cities);

  showTable(table);
};

main();

function loadDataFromFile(fileName) {
  try {
    return fs.readFileSync(fileName, { encoding: "utf-8" });
  } catch (error) {
    console.error(error);
    return;
  }
}

function parseData(data) {
  const lines = data.split("\n");
  const properties = lines.shift().split(",");

  return lines.map((line) => {
    const values = line.split(",");

    if (values.length !== properties.length) {
      throw new Error("Invalid data");
    }

    return properties.reduce((acc, property, index) => {
      acc[property] = values[index];
      return acc;
    }, {});
  });
}

function buildCitiesFromParsedData({ data, maxDensity }) {
  return data.map((city) => {
    return {
      ...city,
      percentage: ((city.density / maxDensity) * 100).toFixed(2),
    };
  });
}

function getMaxDensity(parsedData) {
  return Math.max(...parsedData.map((city) => city.density));
}

function truncate(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

function buildTable(cities) {
  const rows = cities.map((city) =>
    [
      truncate(city.city, ColumnWidth.CITY).padEnd(ColumnWidth.CITY),
      truncate(city.population, ColumnWidth.POPULATION).padStart(
        ColumnWidth.POPULATION
      ),
      truncate(city.area, ColumnWidth.AREA).padStart(ColumnWidth.AREA),
      truncate(city.density, ColumnWidth.DENSITY).padStart(ColumnWidth.DENSITY),
      truncate(city.country, ColumnWidth.COUNTRY).padStart(ColumnWidth.COUNTRY),
      truncate(city.percentage, ColumnWidth.PERCENTAGE).padStart(
        ColumnWidth.PERCENTAGE
      ),
    ].join("")
  );

  return rows.join("\n");
}

function showTable(table) {
  console.log(table);
}
