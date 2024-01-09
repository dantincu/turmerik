import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import FolderOpenIcon from "@mui/icons-material/FolderOpen"
import Container from '@mui/material/Container';
import Modal from '@mui/material/Modal';

import { currentAppTheme } from "../../services/app-theme/app-theme";
import { AppData } from "../../services/appData";
import { setHasFilesRootLocation } from "../../store/appDataSlice";
import Error from "../../components/error/Error";
import { updateHtmlDocTitle } from "../../services/htmlDoc/htmlDocTitle";
import { fsApiSvc } from "../../services/fsApi/fsApiSvc";

import NotesRootLocationPickerModalContent from "./NotesRootLocationPickerModalContent";

export default function AppSetupPage() {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const dispatch = useDispatch();

  const [ error, setError ] = useState<any | null | undefined>(null);
  const [ pickNotesRootLocModalIsOpen, setPickNotesRootLocModalIsOpen ] = useState(false);
  
  const onPickFilesRootLocationClick = () => {
      ((window as any).showDirectoryPicker({
        id: "rootFolder",
        mode: "readwrite",
        startIn: "documents"
      }) as Promise<FileSystemDirectoryHandle>).then(handle => {
        fsApiSvc.rootDirHandle = handle;
        dispatch(setHasFilesRootLocation(true));
        setPickNotesRootLocModalIsOpen(true);
      }, reason => {
        setError(reason);
      });
  }

  const handlePickNotesRootLocModalClose = () => {
    setPickNotesRootLocModalIsOpen(false);
  }

  useEffect(() => {
    updateHtmlDocTitle("Turmerik Notes");
  }, []);

  return (<Container className="trmrk-app-setup-page" maxWidth="xl">
    { error ? <Error errCaption={"No location chosen for notes"}
      errMessage={error?.message ?? error?.cause} /> : <h1>Welcome to Turmerik Notes</h1> }
    
    { appData.hasNotesRootLocation ? null :
      <Typography sx={{ margin: "1em", fontSize: "1.2em", cursor: "pointer", textAlign: "center" }}
          onClick={onPickFilesRootLocationClick}>
        <IconButton>
          <FolderOpenIcon
            sx={{ width: "1.2em", height: "1.2em", color: "#FF8800" }} />
        </IconButton>
        Pick a location on your device where you want to create notes
      </Typography>
    }
    <Modal className={["trmrk-app-setup-modal", currentAppTheme.value.cssClassName].join(" ")}
        open={pickNotesRootLocModalIsOpen}
        onClose={handlePickNotesRootLocModalClose}
        >
        <Box className="trmrk-modal-container">
          <NotesRootLocationPickerModalContent onModalClose={handlePickNotesRootLocModalClose} />
        </Box>
      </Modal>
  </Container>);
};
