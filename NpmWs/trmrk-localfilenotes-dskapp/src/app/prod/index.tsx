import { ApiConfigData } from "trmrk-axios";
import { createApp } from '../index';

import apiConfigData from "./api-config.json";
createApp(apiConfigData as ApiConfigData);
