export const jsonBool = Object.freeze({
  false: "false",
  true: "true",
});

export const getJsonBool = (value: boolean) =>
  value ? jsonBool.true : jsonBool.false;

export const queryKeys = Object.freeze({});

export const localStorageKeys = Object.freeze({
  appThemeIsDarkMode: "appThemeIsDarkMode",
});

export const idxedDBNames = Object.freeze({
  notes: "notes",
  items: "items",
});

export const idxedDBKeys = Object.freeze({
  notes: {},
});
