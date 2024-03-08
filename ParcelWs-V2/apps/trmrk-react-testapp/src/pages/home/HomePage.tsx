import React from "react";

import { Link } from "react-router-dom";

import styled from "@emotion/styled";

import Paper from "@mui/material/Paper";

const Ul = styled.ul({
  margin: "0px",
  padding: "1em"
});

export default function HomePage() {
  return (<Paper sx={{ height: "100%" }}>
    <Ul>
      <li><Link to="/resizables-demo">Resizables Demo</Link></li>
    </Ul>
  </Paper>);
}
