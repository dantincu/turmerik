import React, { useEffect } from "react";

import Container from "@mui/material/Container";

import NotFound from "../../components/notFound/NotFound";
import { updateHtmlDocTitle } from "../../services/htmlDoc/htmlDocTitle";

export default function NotFoundPage() {
  useEffect(() => {
    updateHtmlDocTitle("Page Not Found");
  }, []);

  return (<Container className="trmrk-not-found-page" sx={{ position: "relative" }} maxWidth="xl">
    <NotFound />
  </Container>);
};
