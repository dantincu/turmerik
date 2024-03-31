import React from "react";
import { useDispatch } from "react-redux";

import { Link } from "react-router-dom";

import styled from "@emotion/styled";

import Paper from "@mui/material/Paper";

import { appDataReducers } from "../../store/appDataSlice";

export interface DevModuleHomePageProps {
  urlPath: string;
  exitPath: string;
}

const Ul = styled.ul({
  margin: "1em",
  padding: "1em",
  marginTop: "0px"
});

export default function DevModuleHomePage(
  props: DevModuleHomePageProps
) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(appDataReducers.setCurrentUrlPath(props.urlPath));
  });

  return (<Paper sx={{ height: "100%" }}>
    <Ul>
      <li><Link to={props.exitPath} className="trmrk-nav-link">Exit</Link></li>
      <li><Link to="indexeddb-browser" className="trmrk-nav-link">IndexedDB Browser</Link></li>
    </Ul>
  </Paper>);
}
