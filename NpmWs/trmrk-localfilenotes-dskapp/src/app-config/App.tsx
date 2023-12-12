import React, { useEffect, useState } from "react";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import { ApiConfigData, ApiResponse } from "trmrk-axios";
import { browser as trmrkBrwsr } from "trmrk-browser-core";

import { queryKeys } from "./utils";
import { reducer, AppData } from "../app-config/app-data";

const initialState: AppData = {
};

const AppDataContext = React.createContext<AppData>({});

const App = (
  {
    envName,
    appConfig
  }: {
    envName: string,
    appConfig: ApiConfigData
  }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const value: AppData = {
  };

  return (
    <AppDataContext.Provider value={value}>
      <h1>Hello</h1>
    </AppDataContext.Provider>
  );
};

export default App;
