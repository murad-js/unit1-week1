export const Alignment = Object.freeze({
  START: "start",
  END: "end",
});

export const ColumnConfig = {
  city: { width: 18, align: Alignment.END },
  population: { width: 10, align: Alignment.START },
  area: { width: 8, align: Alignment.START },
  density: { width: 8, align: Alignment.START },
  country: { width: 18, align: Alignment.START },
  percentage: { width: 6, align: Alignment.START },
};
