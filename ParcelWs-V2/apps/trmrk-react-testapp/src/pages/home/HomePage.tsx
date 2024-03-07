import React from "react";

import styled from "@emotion/styled";

import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";

const Ul = styled.ul({
  margin: "0px",
  padding: "1em"
});

export default function HomePage() {
  return (<Paper sx={{ height: "100%" }}>
    <Ul>
      <li><Link href="/resizables-demo">Resizables Demo</Link></li>
    </Ul>
  </Paper>);
}
