import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import NotFound from "../../components/notFound/NotFound";

const NotFoundPage = () => {
  return (<Container sx={{ position: "relative" }} maxWidth="xl">
    <NotFound />
  </Container>);
}

export default NotFoundPage;
