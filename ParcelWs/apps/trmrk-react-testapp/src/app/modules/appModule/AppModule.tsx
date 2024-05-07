import React from "react";
import { Routes, Route } from "react-router-dom";

export interface DevModuleProps {
  basePath: string;
  rootPath: string;
}

import CodeTextCursorPositioning from "./pages/CodeTextCursorPositioning";
import WYSIWYGTextCursorPositioning from "./pages/WYSIWYGTextCursorPositioning";
import AppModuleHomePage from "./AppModuleHomePage";
import NotFound from "../../../trmrk-react/pages/notFound/NotFound";;

export default function DevModule(props: DevModuleProps) {
  return (<Routes>
      <Route path={"/code-text-cursor-positioning"} element={<CodeTextCursorPositioning
        basePath={props.basePath} rootPath={props.rootPath} urlPath={`${props.basePath}/indexeddb-browser`} />} />
      <Route path={"/wysiwyg-text-cursor-positioning"} element={<WYSIWYGTextCursorPositioning
        basePath={props.basePath} rootPath={props.rootPath} urlPath={`${props.basePath}/indexeddb-browser/create-db`} />} />
      <Route path="/" element={<AppModuleHomePage
        basePath={props.basePath} rootPath={props.rootPath} />} />
      <Route path="*" element={ <NotFound /> } />
    </Routes>);
}
