export const jsonBool = Object.freeze({
  false: JSON.stringify(false),
  true: JSON.stringify(true),
});

export const getJsonBool = (value: boolean) =>
  value ? jsonBool.true : jsonBool.false;

export const queryKeys = Object.freeze({});

export const defaultAppTitle = "Turmerik Notes";

export const getAppTitle = (name: string | null = null) => {
  let title = defaultAppTitle;

  if (typeof name === "string") {
    title = [name, defaultAppTitle].join(" - ");
  }

  return title;
};

export const getRoute = (
  routeBase: string,
  path: string | null | undefined = null,
  relPath: string | null | undefined = null
) => {
  const partsArr = [path, relPath]
    .filter((value) => value)
    .map((value) => encodeURIComponent(value!));

  partsArr.splice(0, 0, routeBase);
  const route = partsArr.join("/");

  return route;
};
