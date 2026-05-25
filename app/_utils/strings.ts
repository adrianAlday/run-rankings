export const normalizeStringForFind = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");
