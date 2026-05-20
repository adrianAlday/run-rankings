export type ValueColors = [number, number[]][];

export const getValueRgb = (value: number, valueColors: ValueColors) => {
  const firstCriteria = valueColors[0];
  if (value <= firstCriteria[0]) {
    return firstCriteria[1];
  }

  const lastCriteria = valueColors[valueColors.length - 1];
  if (value >= lastCriteria[0]) {
    return lastCriteria[1];
  }

  const higherIndex = valueColors.findIndex((criteria) => value <= criteria[0]);
  const higherCriteria = valueColors[higherIndex];
  const lowerCriteria = valueColors[higherIndex - 1];
  const split =
    (value - lowerCriteria[0]) / (higherCriteria[0] - lowerCriteria[0]);

  return lowerCriteria[1].map(
    (lowerColor, index) =>
      lowerColor + (higherCriteria[1][index] - lowerColor) * split,
  );
};
