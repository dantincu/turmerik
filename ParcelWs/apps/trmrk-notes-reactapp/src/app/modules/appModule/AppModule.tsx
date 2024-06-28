import React from "react";
import { Routes, Route } from "react-router-dom";

export interface AppModuleProps {
  basePath: string;
  rootPath: string;
}

import AppModuleHomePage from "./AppModuleHomePage";
import FoldersPage from "./pages/folders/FoldersPage";
import NotFound from "../../../trmrk-react/pages/notFound/NotFound";;

export default function AppModule(props: AppModuleProps) {
  return (<Routes>
      <Route path="/folders" element={<FoldersPage
        basePath={props.basePath} rootPath={props.rootPath} />} />
      <Route path="/" element={<AppModuleHomePage
        basePath={props.basePath} rootPath={props.rootPath} />} />
      <Route path="*" element={ <NotFound /> } />
    </Routes>);
}
