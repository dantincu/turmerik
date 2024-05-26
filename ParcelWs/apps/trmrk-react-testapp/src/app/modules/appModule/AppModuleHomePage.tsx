import React from "react";
import { Link } from "react-router-dom";

export interface AppModuleHomePageProps {
  basePath: string;
  rootPath: string;
}

import AppBarsPanel from "../../../trmrk-react/components/barsPanel/AppBarsPanel";

import { appBarSelectors, appBarReducers } from "../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../store/appDataSlice";

export default function AppModuleHomePage(props: AppModuleHomePageProps) {
  
  return (<AppBarsPanel basePath={props.basePath}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}>
    <ul className="trmrk-ul">
      <li><Link to={`${props.rootPath}dev`} className="trmrk-nav-link">Development Module</Link></li>
      <li><Link to={`${props.basePath}/code-text-cursor-positioning`} className="trmrk-nav-link">Code text cursor positioning</Link></li>
      <li><Link to={`${props.basePath}/wysiwyg-text-cursor-positioning`} className="trmrk-nav-link">WYSIWYG text cursor positioning</Link></li>
      <li><Link to={`${props.basePath}/input-text-cursor-positioning`} className="trmrk-nav-link">Input text cursor positioning</Link></li>
      <li><Link to={`${props.basePath}/long-press-demo`} className="trmrk-nav-link">Long Press Demo</Link></li>
      <li><Link to={`${props.basePath}/view-local-storage`} className="trmrk-nav-link">View Local Storage</Link></li>
    </ul>
  </AppBarsPanel>);
}