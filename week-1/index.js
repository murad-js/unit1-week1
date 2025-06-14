'use strict';

import fs from 'node:fs';
import { Alignment, ColumnConfig } from './shared.js';

const main = () => {
  const data = loadDataFromFile('data.csv');

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
    return fs.readFileSync(fileName, { encoding: 'utf-8' });
  } catch (error) {
    console.error(error);
  }
}

function parseData(data) {
  const lines = data.split('\n');
  const properties = lines.shift().split(',');

  return lines.map((line) => {
    const values = line.split(',');

    if (values.length !== properties.length) {
      throw new Error('Invalid data');
    }

    return properties.reduce((acc, property, index) => {
      acc[property] = values[index];
      return acc;
    }, {});
  });
}

function getMaxDensity(parsedData) {
  return Math.max(...parsedData.map((city) => city.density));
}

function buildCitiesFromParsedData({ data, maxDensity }) {
  return data.map((city) => {
    return {
      ...city,
      percentage: Math.round((city.density * 100) / maxDensity).toString(),
    };
  });
}

function buildTable(cities, config = ColumnConfig) {
  const rows = cities.map((city) => {
    const cells = [];

    for (const property in city) {
      cells.push(
        buildCell({
          value: city[property],
          maxLength: config[property].width,
          alignment: config[property].align,
        }),
      );
    }

    return buildRow(cells);
  });

  return rows.join('\n');
}

function buildRow(cells) {
  return cells.join('');
}

function buildCell({ value, maxLength, alignment }) {
  return alignment === Alignment.START
    ? value.padStart(maxLength)
    : value.padEnd(maxLength);
}

function showTable(table) {
  console.log(table);
}
