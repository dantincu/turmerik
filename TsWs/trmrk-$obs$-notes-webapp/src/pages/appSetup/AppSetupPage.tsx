import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import FolderOpenIcon from "@mui/icons-material/FolderOpen"
import Container from '@mui/material/Container';
import Modal from '@mui/material/Modal';

import { appModeCssClasses } from "../../services/utils";
import { currentAppTheme } from "../../services/app-theme/app-theme";
import { AppData } from "../../services/appData";
import { setHasFilesRootLocation } from "../../store/appDataSlice";
import Error from "../../components/error/Error";
import { updateHtmlDocTitle } from "../../services/htmlDoc/htmlDocTitle";
import { fsApiSvc } from "../../services/fsApi/fsApiSvc";
import { supportedFeatures } from "../../services/htmlDoc/htmlFeatures";
import { appCfg } from "../../services/appConfig";

import NotesRootLocationPickerModalContent from "./NotesRootLocationPickerModalContent";

export default function AppSetupPage() {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const dispatch = useDispatch();

  const [ error, setError ] = useState<any | null | undefined>(null);
  const [ storageOptionChosen, setStorageOptionChosen ] = useState(!(appCfg.value.allowUserToChooseStorageOptions ?? false));
  const [ pickNotesRootLocModalIsOpen, setPickNotesRootLocModalIsOpen ] = useState(false);

  let chooseNotesRootLocationCaption: string = [
    "Pick a location on your", appData.useFileSystemApiForStorage ? "device" : "drive" ].join(" ");

  const onPickFilesRootLocationClick = () => {
    try {
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
    catch (err) {
      setError(err);
    }
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
      storageOptionChosen ? <Typography
          onClick={onPickFilesRootLocationClick} className="trmrk-caption">
        <IconButton>
          <FolderOpenIcon
            sx={{ width: "1em", height: "1em", color: "#FF8800" }} />
        </IconButton>
        { chooseNotesRootLocationCaption }
      </Typography> : <Box className="trmrk-storage-options-list">
      <Typography className="trmrk-caption">
        Choose one of the available storage options for your notes
      </Typography>
    </Box>
    }
    <Modal className={["trmrk-modal trmrk-app-setup-modal", currentAppTheme.value.cssClassName, appModeCssClasses.compactMode ].join(" ")}
        open={pickNotesRootLocModalIsOpen}
        onClose={handlePickNotesRootLocModalClose}
        >
        <Box className="trmrk-modal-container">
          <NotesRootLocationPickerModalContent onModalClose={handlePickNotesRootLocModalClose} />
        </Box>
      </Modal>
  </Container>);
};
