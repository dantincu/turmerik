import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { appDataSelectors, appDataReducers } from "../../store/appDataSlice";
import { appBarSelectors, appBarReducers } from "../../store/appBarDataSlice";

import HomePage from "./pages/home/HomePage";
import ResizablesDemo from "./pages/resizablesDemo/ResizablesDemo";

import FloatingBarsPage from "../../components/floatingBarsPanel/FloatingBarsPage";
import NotFound from "../../pages/notFound/NotFound";

export interface AppModuleProps {
  basePath: string;
  rootPath: string;
}

export default function AppModule(props: AppModuleProps) {
  const [ appBarRowsCount, setAppBarRowsCount ] = React.useState(1);

  const increaseHeaderHeightBtnClicked = () => {
    if (appBarRowsCount < 20) {
      setAppBarRowsCount(appBarRowsCount + 1);
    }
  }

  const decreaseHeaderHeightBtnClicked = () => {
    if (appBarRowsCount > 1) {
      setAppBarRowsCount(appBarRowsCount - 1);
    }
  }
  
  const refreshBtnRef = React.createRef<HTMLButtonElement>();
  
  const basePaths = {
    basePath: props.basePath,
    rootPath: props.rootPath
  }

  return (<FloatingBarsPage
      className="trmrk-app"
      headerClassName="trmrk-app-header"
      basePath={props.basePath}
      panelScrollableY={true}
      headerRowsCount={appBarRowsCount}
      footerRowsCount={1}
      appBarClassName="trmrk-app-module-bar"
      appBarChildren={[
        <IconButton key={0} className="trmrk-icon-btn" onClick={increaseHeaderHeightBtnClicked}><KeyboardArrowDownIcon /></IconButton>,
        <IconButton key={1} className="trmrk-icon-btn" onClick={decreaseHeaderHeightBtnClicked}><KeyboardArrowUpIcon /></IconButton>]}
      bodyClassName="trmrk-app-body"
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      footerContent={<React.Fragment>FOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOTEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEER</React.Fragment>}>
    <Routes>
      <Route path="resizables-demo" element={
        <ResizablesDemo
          refreshBtnRef={refreshBtnRef}
          urlPath={`${props.basePath}resizables-demo`}
          {...basePaths} />}></Route>
      <Route path="" element={<HomePage
          urlPath={props.basePath}
          {...basePaths} />}></Route>
      <Route path="*" element={ <NotFound /> } />
    </Routes>
  </FloatingBarsPage>);
}
