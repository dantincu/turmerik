import React, { useEffect, useState } from "react";

import { reducer, actions, AppData } from "./app-data";

export const AppDataContext = React.createContext({} as AppData);
