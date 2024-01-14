import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import FolderOpenIcon from "@mui/icons-material/FolderOpen"

import { currentAppTheme } from "../../services/app-theme/app-theme";
import { AppData } from "../../services/appData";
import { setHasFilesRootLocation } from "../../store/appDataSlice";
import Error from "../../components/error/Error";
import { updateHtmlDocTitle } from "../../services/htmlDoc/htmlDocTitle";
import { fsApiSvc } from "../../services/fsApi/fsApiSvc";
import { appCfg } from "../../services/appConfig";

export default function AppSetupPage({
    setAppBodyEl,
    onUserScroll
  }: {
    setAppBodyEl: (appBodyElem: HTMLDivElement) => void,
    onUserScroll: () => void
  }) {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const dispatch = useDispatch();

  const appBodyEl = useRef<HTMLDivElement>(null);

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

  const onScroll = () => onUserScroll();

  useEffect(() => {
    updateHtmlDocTitle("Turmerik Notes");
    const bodyEl = appBodyEl.current!;
    setAppBodyEl(bodyEl);
    bodyEl!.addEventListener("scroll", onScroll);

    return () => {
      bodyEl!.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (<Box className={["trmrk-app-setup-page", "trmrk-scrollable", currentAppTheme.value.cssClassName].join(" ")} ref={appBodyEl}>
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
      <Typography className="trmrk-caption" sx={{ height: "1000vh" }}>
        Choose one of the available storage options for your notes
      </Typography>
    </Box>
    }
  </Box>);
};
