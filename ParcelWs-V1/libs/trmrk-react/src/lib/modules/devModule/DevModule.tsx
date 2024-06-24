import React from "react";
import { Routes, Route } from "react-router-dom";

import { AppBarSelectors, AppBarReducers } from "../../redux/appBarData";
import { AppDataSelectors, AppDataReducers } from "../../redux/appData";

export interface DevModuleProps {
  basePath: string;
  rootPath: string;
  appBarSelectors: AppBarSelectors;
  appBarReducers: AppBarReducers;
  appDataSelectors: AppDataSelectors;
  appDataReducers: AppDataReducers;
}

import IndexedDbBrowserPage from "./pages/indexedDbBrowser/IndexedDbBrowserPage";
import IndexedDbBrowserCreateDbPage from "./pages/indexedDbBrowser/IndexedDbBrowserCreateDbPage";
import IndexedDbBrowserEditDbPage from "./pages/indexedDbBrowser/IndexedDbBrowserEditDbPage";
import DevModuleHomePage from "./DevModuleHomePage";
import NotFound from "../../pages/notFound/NotFound";

export default function DevModule(props: DevModuleProps) {
  return (<Routes>
      <Route path={"/indexeddb-browser"} element={<IndexedDbBrowserPage
        rootPath={props.rootPath}
        urlPath={`${props.basePath}/indexeddb-browser`}
        appBarSelectors={props.appBarSelectors}
        appBarReducers={props.appBarReducers}
        appDataSelectors={props.appDataSelectors}
        appDataReducers={props.appDataReducers} />} />
      <Route path={"/indexeddb-browser/create-db"} element={<IndexedDbBrowserCreateDbPage
        urlPath={`${props.basePath}/indexeddb-browser/create-db`}
        appBarSelectors={props.appBarSelectors}
        appBarReducers={props.appBarReducers}
        appDataSelectors={props.appDataSelectors}
        appDataReducers={props.appDataReducers} />} />
      <Route path={"/indexeddb-browser/edit-db"} element={<IndexedDbBrowserEditDbPage
        urlPath={`${props.basePath}/indexeddb-browser/edit-db`}
        appBarSelectors={props.appBarSelectors}
        appBarReducers={props.appBarReducers}
        appDataSelectors={props.appDataSelectors}
        appDataReducers={props.appDataReducers} />} />
      <Route path="/" element={<DevModuleHomePage
        exitPath={props.rootPath}
        urlPath={props.basePath}
        appBarSelectors={props.appBarSelectors}
        appBarReducers={props.appBarReducers}
        appDataSelectors={props.appDataSelectors}
        appDataReducers={props.appDataReducers} />} />
      <Route path="*" element={ <NotFound /> } />
    </Routes>);
}
