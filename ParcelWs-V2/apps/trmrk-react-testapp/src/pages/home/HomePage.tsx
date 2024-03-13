import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import styled from "@emotion/styled";

import Paper from "@mui/material/Paper";

import { appDataReducers } from "../../store/appDataSlice";

export interface HomePageProps {
  urlPath: string
}

const Ul = styled.ul({
  margin: "0px",
  padding: "1em"
});

export default function HomePage(
  props: HomePageProps
) {
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    dispatch(appDataReducers.setCurrentUrlPath(props.urlPath));
  });

  return (<Paper sx={{ height: "100%" }}>
    <Ul>
      <li><Link to="resizables-demo" className="trmrk-nav-link">Resizables Demo</Link></li>
      <li><Link to="dev" className="trmrk-nav-link">Development Module</Link></li>
    </Ul>
  </Paper>);
}
