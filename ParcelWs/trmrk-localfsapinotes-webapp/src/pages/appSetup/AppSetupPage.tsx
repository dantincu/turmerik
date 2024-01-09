import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import FolderOpenIcon from "@mui/icons-material/FolderOpen"
import Container from '@mui/material/Container';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { currentAppTheme } from "../../services/app-theme/app-theme";
import CharIcon from "../../components/iconButtons/CharIcon";
import { AppData } from "../../services/appData";
import { setHasFilesRootLocation } from "../../store/appDataSlice";
import Error from "../../components/error/Error";
import { updateHtmlDocTitle } from "../../services/htmlDoc/htmlDocTitle";
import { fsApiSvc } from "../../services/fsApi/fsApiSvc";

export default function AppSetupPage() {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const dispatch = useDispatch();

  const [ error, setError ] = useState<any | null | undefined>(null);
  const [ pickNotesRootLocModalIsOpen, setPickNotesRootLocModalIsOpen ] = useState(false);
  const [ editNotesRootLocAddressBar, setNotesRootLocAddressBar ] = useState(false);

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

  const pickNotesRootLocModalStyle = {
    position: 'absolute',
    top: '0px', left: '0px', right: '0px', bottom: '0px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    updateHtmlDocTitle("Turmerik Notes");
  }, []);

  console.log("currentAppTheme.value.cssClassName", currentAppTheme.value.cssClassName);

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
    <Modal className={["trmrk-app-setup-modal-wrapper", currentAppTheme.value.cssClassName].join(" ")}
        open={pickNotesRootLocModalIsOpen}
        onClose={handlePickNotesRootLocModalClose}
      >
        <Box sx={pickNotesRootLocModalStyle} className="trmrk-app-setup-modal">
          <IconButton className="trmrk-close-btn" onClick={handlePickNotesRootLocModalClose}>
            <CharIcon
              fontSize="2.5em" lineHeight="0.8">&times;</CharIcon>
          </IconButton>
          <Box className="trmrk-title">
            <Typography variant="h5" component="h2">
              Choose a default location for your notes
            </Typography>
          </Box>
          <Box className="trmrk-container trmrk-scrollable">
            <Box className="trmrk-content">
              <Box className="trmrk-address-bar" sx={{ }}>
                { editNotesRootLocAddressBar ? <Box className="trmrk-edit-bar">
                  <TextField fullWidth={true} sx={{ lineHeight: "0.5" }} />
                </Box> : <Box className="trmrk-readonly-bar">
                  asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf
                  asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf
                  asdfasdf asdfasdf
                </Box> }
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
  </Container>);
};
