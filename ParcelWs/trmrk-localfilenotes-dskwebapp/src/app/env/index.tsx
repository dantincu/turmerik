import { ApiConfigData } from "trmrk-axios/src/core";
import { createApp } from '../index';

import appConfigData from "./api-config.json";
createApp(appConfigData as ApiConfigData);
