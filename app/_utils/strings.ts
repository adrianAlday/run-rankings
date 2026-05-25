export const capitalize = (value: string) =>
  value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

export const normalizeStringForFind = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");
