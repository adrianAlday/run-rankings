export const encodeParam = (value: string) =>
  encodeURIComponent(value).replace(/%20/g, "+");
