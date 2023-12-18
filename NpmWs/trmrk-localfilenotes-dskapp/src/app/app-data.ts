import { AppConfigData } from "trmrk/src/notes-app-config";

export interface AppData {
  appConfig: AppConfigData;
  isDarkMode: boolean;
}

export const actions = Object.freeze({
  SET_IS_DARK_MODE: "SET_IS_DARK_MODE",
  SET_APP_CONFIG: "SET_APP_CONFIG",
});

const onSetIsDarkMode = (
  state: AppData,
  action: { type: string; payload: boolean }
) => {
  return {
    ...state,
    isDarkMode: action.payload,
  };
};

const onSetAppConfig = (
  state: AppData,
  action: { type: string; payload: AppConfigData }
) => {
  return {
    ...state,
    appConfig: action.payload,
  };
};

export const reducer = (
  state: AppData,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case actions.SET_IS_DARK_MODE:
      return onSetIsDarkMode(state, action);
    case actions.SET_APP_CONFIG:
      return onSetAppConfig(state, action);
    default:
      return state;
  }
};
