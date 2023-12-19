import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { reducer, actions, AppData } from "../../app/app-data";
import { AppDataContext } from "../../app/AppContext";

const HomePage = () => {
  const appData = React.useContext(AppDataContext);

  return (<Container sx={{ position: "relative" }} maxWidth="xl"></Container>);
}

export default HomePage;
