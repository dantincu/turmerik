import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import styled from "@emotion/styled";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";

import { appDataReducers } from "../../../../store/appDataSlice";

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

  return (<Paper sx={{ width: "100%", height: "1000px", marginTop: "0px", paddingTop: "0px" }}>
    <Ul>
      <li><Link to="resizables-demo" className="trmrk-nav-link">Resizables Demo</Link></li>
      <li><Link to={`${props.rootPath}dev`} className="trmrk-nav-link">Development Module</Link></li>
    </Ul>
    <Box sx={{ margin: "auto", position: "fixed", top: "50vh", left: "calc(50vw - 100px)" }}><Input /></Box>
  </Paper>);
}
