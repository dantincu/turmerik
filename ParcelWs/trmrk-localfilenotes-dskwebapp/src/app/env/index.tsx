import { ApiConfigData } from "trmrk-axios/src/core";
import { createApp } from '../index';

// import appConfigData from "./api-config.json";

const appConfigData: ApiConfigData = {
  apiHost: process.env.API_HOST!,
  apiRelUriBase: process.env.API_REL_URI_BASE!,
  clientVersion: parseFloat(process.env.CLIENT_VERSION!)
}

createApp(appConfigData);
