import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Container from "@mui/material/Container";

import trmrk from "trmrk";

export default function FilesHcyPage() {
  return (<Container className="trmrk-video-viewer-page" sx={{ position: "relative" }} maxWidth="xl">File Explorer</Container>);
}
