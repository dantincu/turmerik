import React from "react";
import { Routes, Route } from "react-router-dom";

export interface DevModuleProps {
  basePath: string;
  rootPath: string;
}

import CodeTextCursorPositioningPage from "./pages/CodeTextCursorPositioningPage";
import WYSIWYGTextCursorPositioningPage from "./pages/WYSIWYGTextCursorPositioningPage";
import TextInputCursorPositioningPage from "./pages/TextInputCursorPositioningPage";
import LongPressDemoPage from "./pages/LongPressDemoPage";
import ViewLocalStoragePage from "./pages/ViewLocalStorage";
import AppModuleHomePage from "./AppModuleHomePage";
import NotFound from "../../../trmrk-react/pages/notFound/NotFound";;

export default function DevModule(props: DevModuleProps) {
  return (<Routes>
      <Route path={"/code-text-cursor-positioning"} element={<CodeTextCursorPositioningPage
        basePath={props.basePath} rootPath={props.rootPath} urlPath={`${props.basePath}/code-text-cursor-positioning`} />} />
      <Route path={"/wysiwyg-text-cursor-positioning"} element={<WYSIWYGTextCursorPositioningPage
        basePath={props.basePath} rootPath={props.rootPath} urlPath={`${props.basePath}/wysiwyg-text-cursor-positioning`} />} />
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
