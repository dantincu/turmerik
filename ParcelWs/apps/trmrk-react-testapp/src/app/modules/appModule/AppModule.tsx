import React from "react";
import { Routes, Route } from "react-router-dom";

export interface DevModuleProps {
  basePath: string;
  rootPath: string;
}

import TextInputCursorPositioningPage from "./pages/TextInputCursorPositioningPage";
import LongPressDemoPage from "./pages/LongPressDemoPage";
import ViewLocalStoragePage from "./pages/ViewLocalStorage";
import AppModuleHomePage from "./AppModuleHomePage";
import NotFound from "../../../trmrk-react/pages/notFound/NotFound";;

export default function DevModule(props: DevModuleProps) {
  return (<Routes>
      <Route path={"/input-text-cursor-positioning"} element={<TextInputCursorPositioningPage
        basePath={props.basePath} rootPath={props.rootPath} urlPath={`${props.basePath}/input-text-cursor-positioning`} />} />
        <Route path={"/long-press-demo"} element={<LongPressDemoPage
        basePath={props.basePath} rootPath={props.rootPath} urlPath={`${props.basePath}/long-press-demo`} />} />
      <Route path={"/view-local-storage"} element={<ViewLocalStoragePage />} />
      <Route path="/" element={<AppModuleHomePage
        basePath={props.basePath} rootPath={props.rootPath} />} />
      <Route path="*" element={ <NotFound /> } />
    </Routes>);
}
