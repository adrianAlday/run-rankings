export const encodeParam = (value: string | number) =>
  encodeURIComponent(value).replace(/%20/g, "+");
