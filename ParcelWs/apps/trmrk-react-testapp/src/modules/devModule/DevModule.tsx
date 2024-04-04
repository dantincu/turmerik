import React from "react";
import { Routes, Route } from "react-router-dom";

export interface DevModuleProps {
  basePath: string;
  rootPath: string;
}

import IndexedDbBrowserPage from "./pages/indexedDbBrowser/IndexedDbBrowserPage";
import IndexedDbBrowserCreateDbPage from "./pages/indexedDbBrowser/IndexedDbBrowserCreateDbPage";
import IndexedDbBrowserEditDbPage from "./pages/indexedDbBrowser/IndexedDbBrowserEditDbPage";
import DevModuleHomePage from "./DevModuleHomePage";
import NotFound from "../../pages/notFound/NotFound";;

export default function DevModule(props: DevModuleProps) {
  return (<Routes>
      <Route path={"/indexeddb-browser"} element={<IndexedDbBrowserPage
        rootPath={props.rootPath} urlPath={`${props.basePath}/indexeddb-browser`} />} />
      <Route path={"/indexeddb-browser/create-db"} element={<IndexedDbBrowserCreateDbPage
        urlPath={`${props.basePath}/indexeddb-browser/create-db`} />} />
      <Route path={"/indexeddb-browser/edit-db"} element={<IndexedDbBrowserEditDbPage
        urlPath={`${props.basePath}/indexeddb-browser/edit-db`} />} />
      <Route path="/" element={<DevModuleHomePage
        exitPath={props.rootPath} urlPath={props.basePath} />} />
      <Route path="*" element={ <NotFound /> } />
    </Routes>);
}
