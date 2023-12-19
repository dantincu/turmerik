import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { AppDataContext, updateAppTitle } from "../../app/AppContext";
import NotFound from "../../components/notFound/NotFound";

const NotFoundPage = () => {
  const appData = React.useContext(AppDataContext);

  useEffect(() => {
    updateAppTitle(appData, "Page Not Found");
  }, []);

  return (<Container sx={{ position: "relative" }} maxWidth="xl">
    <NotFound />
  </Container>);
}

export default NotFoundPage;
