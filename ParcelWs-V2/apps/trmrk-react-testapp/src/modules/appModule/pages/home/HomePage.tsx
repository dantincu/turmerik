import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import styled from "@emotion/styled";

import Paper from "@mui/material/Paper";

import { appDataReducers } from "../../../../store/appDataSlice";
import { appBarReducers } from "../../../../store/appBarDataSlice";

export interface HomePageProps {
  urlPath: string;
  basePath: string;
  rootPath: string;
}

const Ul = styled.ul({
  margin: "1em",
  padding: "1em",
  marginTop: "0px"
});

export default function HomePage(
  props: HomePageProps
) {
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    dispatch(appDataReducers.setCurrentUrlPath(props.urlPath));
  });

  return (<Paper sx={{ height: "100%", marginTop: "0px", paddingTop: "0px" }}>
    <Ul>
      <li><Link to="resizables-demo" className="trmrk-nav-link">Resizables Demo</Link></li>
      <li><Link to={`${props.rootPath}dev`} className="trmrk-nav-link">Development Module</Link></li>
    </Ul>
  </Paper>);
}
