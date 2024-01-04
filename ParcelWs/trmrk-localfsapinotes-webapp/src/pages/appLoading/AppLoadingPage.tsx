import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import FolderOpenIcon from "@mui/icons-material/FolderOpen"

import { setHasFsApiRootDirHandle } from "../../store/appDataSlice";
import Error from "../../components/error/Error";
import { updateHtmlDocTitle } from "../../services/htmlDoc/htmlDocTitle";
import { fsApiSvc } from "../../services/fsApi/fsApiSvc";

export default function AppLoadingPage() {
  const [ error, setError ] = useState<any | null | undefined>(null);
  const dispatch = useDispatch();

  const onClick = () => {
      const x = ((window as any).showDirectoryPicker({
        id: "rootFolder",
        mode: "readwrite",
        startIn: "documents"
      }) as Promise<FileSystemDirectoryHandle>).then(handle => {
        fsApiSvc.rootDirHandle = handle;
        dispatch(setHasFsApiRootDirHandle(true));
      }, reason => {
        setError(reason);
      });
  }

  useEffect(() => {
    updateHtmlDocTitle("Turmerik Notes");
  }, []);

  return (<Container className="trmrk-loading-page" maxWidth="xl">
    <Error errCaption="No location for notes"
      errMessage={error?.message ?? error?.cause} />
    <Typography sx={{ margin: "1em", fontSize: "1.2em", cursor: "pointer", textAlign: "center" }} onClick={onClick}>
      <IconButton><FolderOpenIcon sx={{ width: "1.2em", height: "1.2em", color: "#FF8800" }} /></IconButton>
      Pick a location where you want to create notes</Typography>
  </Container>);
};
