import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Container from "@mui/material/Container";

import { core as trmrk } from "trmrk";

export default function HomePage() {
  return (
    <Container className="trmrk-home-page" maxWidth="xl" sx={{ height: "800px" }}>Home</Container>);
}
