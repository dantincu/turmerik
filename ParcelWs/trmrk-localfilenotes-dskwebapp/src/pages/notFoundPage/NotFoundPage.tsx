import React, { useEffect } from "react";
import { useSelector } from 'react-redux'

import Container from "@mui/material/Container";

import NotFound from "../../components/notFound/NotFound";
import { updateAppTitle } from "../../services/utils";

import { AppData } from "../../services/appData";

const NotFoundPage = () => {
  const appData = useSelector<{ appData: AppData }, AppData>(state => state.appData);

  useEffect(() => {
    updateAppTitle(appData, "Page Not Found");
  }, []);

  return (<Container className="trmrk-not-found-page" sx={{ position: "relative" }} maxWidth="xl">
    <NotFound />
  </Container>);
}

export default NotFoundPage;
