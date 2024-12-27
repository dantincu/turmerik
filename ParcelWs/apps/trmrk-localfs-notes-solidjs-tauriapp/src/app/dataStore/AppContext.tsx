import { useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { AppContext, createAppData, AppContextType, NestedPaths, AppData } from "./core";

export const AppProvider = (props: any) => {
  const [appData, setAppData] = createStore(createAppData());

  console.log("appData", appData);

  const appContextType: AppContextType = {
    appData,
    setAppDataFull: setAppData,
    setAppData: (path: NestedPaths<AppData>, value: any) => {
      setAppData(path.split(".") as any, value);
    }
  };

  return (
    <AppContext.Provider value={appContextType}>
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext)!;
