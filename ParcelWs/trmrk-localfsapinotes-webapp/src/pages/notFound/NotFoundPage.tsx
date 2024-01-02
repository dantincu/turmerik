import React, { useEffect } from "react";
import { useSelector } from 'react-redux'

import Container from "@mui/material/Container";

import NotFound from "../../components/notFound/NotFound";
import { updateHtmlDocTitle } from "../../services/htmlDoc/htmlDocTitle";

const NotFoundPage = () => {
  useEffect(() => {
    updateHtmlDocTitle("Page Not Found");
  }, []);

  return (<Container className="trmrk-not-found-page" sx={{ position: "relative" }} maxWidth="xl">
    <NotFound />
  </Container>);
}

export default NotFoundPage;
