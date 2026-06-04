const encodeParam = (value: string | number) =>
  encodeURIComponent(value).replace(/%20/g, "+");

export const generateQueryString = (
  originalParams: { key: string; value: string | number }[],
  newParams: { [key: string]: string | number },
) =>
  originalParams
    .map(
      (param) =>
        `${param.key}=${encodeParam(
          Object.hasOwn(newParams, param.key)
            ? newParams[param.key]
            : param.value,
        )}`,
    )
    .join("&");

export const replaceUrl = (newUrl: string) => {
  window.history.replaceState(
    { ...window.history.state, as: newUrl, url: newUrl },
    "",
    newUrl,
  );
};
