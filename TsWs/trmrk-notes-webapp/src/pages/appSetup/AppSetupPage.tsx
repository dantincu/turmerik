import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";

import FolderOpenIcon from "@mui/icons-material/FolderOpen"
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import trmrk from "trmrk";

import { currentAppTheme } from "../../services/app-theme/app-theme";
import { appModeCssClass } from "../../services/utils";
import ErrorEl from "../../components/error/ErrorEl";
import FilesHcy from "../../components/filesHcy/FilesHcy";
import { updateHtmlDocTitle } from "trmrk-browser/src/domUtils/htmlDocTitle";
import { driveExplorerSvc } from "../../services/driveExplorer/DriveExplorerSvc";
import { appCfg, TrmrkStorageOption } from "../../services/appConfig";
import { getStorageOption, setStorageOption, setShowSetupPage } from "../../store/storageOptionSlice";
import { setShowAppBar, setShowAppBarToggleBtn } from "../../store/appDataSlice";
import { DriveExplorerApi as FsDriveExplorerApi } from "trmrk-browser/src/FsApiDriveExplorer/api";
import PageContainer from "../../components/mainContent/PageContainer";

/* 
There are 3 steps in the setup page:
 - The user chooses the storage type (IndexedDB / FileSystemApi / local api / cloud storage)
 - After the user confirms the selection, a second confirm section shows app asking the user to choose a location for storing the notes
 - After the user chooses and confirms the chosen location for storing the notes, the main app is then shown
*/

export default function AppSetupPage({
    setAppBodyEl,
    onUserScroll
  }: {
    setAppBodyEl: (appBodyElem: HTMLDivElement) => void,
    onUserScroll: () => void
  }) {
  const storageOption = useSelector(getStorageOption);
  const dispatch = useDispatch();
  const appConfig = appCfg.value;

  const appBodyEl = useRef<HTMLDivElement | null>(null);
  const lastBodyScrollTop = useRef(0);

  const [ error, setError ] = useState<Error | any | null | undefined>(null);
  const [ storageOptionVal, setStorageOptionVal ] = useState(storageOption);

  const [ debugJson, setDebugJson ] = useState<any | null>(null);
  const [ debugJsonErr, setDebugJsonErr ] = useState<Error | any | null>(null);

  // decides whether the step number is 3 or less
  const [ chooseNoteBookRootLocation, setChooseNoteBookRootLocation ] = useState<boolean>(false);

  const onSetAppBodyEl = (el: HTMLDivElement) => {
    appBodyEl.current = el;
    setAppBodyEl(el);
  }

  // Called when the user confirms the selected storage type (step 1)
  const handleAuthorizeStorage = () => {
    if (storageOptionVal) {
      dispatch(setStorageOption({
        ...storageOptionVal
      }));
    } else {
      dispatch(setStorageOption(null));
    }
  }

  // Called whenever the selected storage type changes (step 1)
  const handleNotesStorageOptionChange = (event: SelectChangeEvent<TrmrkStorageOption>) => {
    const chosenOption = appConfig.storageOptions!.find(option => option.storage === event.target.value) ?? null;
    setStorageOptionVal(chosenOption);
  }

  const setJsonData = async () => {
    try {
      const rootFolder = await driveExplorerSvc.svc!.GetFolder({
        path: ""
      });

      setDebugJson(rootFolder);
    }
    catch (err) {
      setDebugJsonErr((err as Error)?.message ?? err);
    }
  }

  // Called when the user decides to pick a location where their notes will be stored (step 2)
  const onPickFilesRootLocationClick = () => {
    try {
      if (storageOption!.storage === TrmrkStorageOption.FileSystemApi){
        ((window as any).showDirectoryPicker({
            id: "rootFolder",
            mode: "readwrite",
            startIn: "documents"
          }) as Promise<FileSystemDirectoryHandle>).then(handle => {
            driveExplorerSvc.svc = new FsDriveExplorerApi(handle);
            setJsonData();
            setChooseNoteBookRootLocation(true);
            dispatch(setShowAppBar(true));
            dispatch(setShowAppBarToggleBtn(true));
          }, reason => {
            setError(reason);
          });
      }
      else {
        setChooseNoteBookRootLocation(true);
        dispatch(setShowAppBar(true));
        dispatch(setShowAppBarToggleBtn(true));
      }
    }
    catch (err) {
      setError(err);
    }
  }

  const onScroll = () => {
    lastBodyScrollTop.current = appBodyEl.current!.scrollTop;
    onUserScroll();
  }

  useEffect(() => {
    updateHtmlDocTitle("Turmerik Notes");

    if (!appConfig.storageOptions) {
      setError(new Error("Invalid Configuration File"));
    } else {
      const bodyEl = appBodyEl.current!;

      bodyEl.scrollTop = lastBodyScrollTop.current;
      bodyEl!.addEventListener("scroll", onScroll);

      return () => {
        bodyEl!.removeEventListener("scroll", onScroll);
      };
    }
  }, [ appBodyEl.current, lastBodyScrollTop, chooseNoteBookRootLocation, debugJsonErr, debugJson ]);

  const ContainerEl = ({
    children,
    className,
    useCompactMode
  } : {
    children: React.ReactNode,
    className?: string | null,
    useCompactMode?: boolean | null | undefined
  }) => <PageContainer
      className={["trmrk-app-setup-page", currentAppTheme.value.cssClassName, appModeCssClass.value, className ?? ""].join(" ")}
      setRefEl={onSetAppBodyEl}
      leftPanelComponent={() => null}
      useCompactMode={useCompactMode}>
    { children }
  </PageContainer>;

  const TitleEl = () => <Typography variant="h2" component="h1" sx={{
      padding: "0.2em", textAlign: "center" }}>
        Turmerik Notes
    </Typography>;

  if (chooseNoteBookRootLocation) {
    const json = debugJsonErr ?? debugJson;
    const PreEl = styled.pre`width: 100%; text-align: left; padding: 0em 1em; ${debugJsonErr ? "color: orangered;" : ""}`;

    return (
    <ContainerEl>
      { // <PreEl>{ JSON.stringify(json, null, " ") } </PreEl>
      }
      <FilesHcy driveExplorerSvc={driveExplorerSvc.svc!} />
    </ContainerEl>);
  } else {
    return (
    <ContainerEl className="trmrk-app-page-no-app-bar" useCompactMode={true}>
      <TitleEl />
      <Box className="trmrk-storage-options-list">
        <Typography className="trmrk-caption">
          Pick one of the available storage options for your notes
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="trmrk-select-storage-option-label">Storage</InputLabel>
          <Select
            labelId="trmrk-select-storage-option-label"
            id="trmrk-select-storage-option"
            label="Storage Option"
            onChange={handleNotesStorageOptionChange}
            value={storageOptionVal?.storage ?? ("" as any as TrmrkStorageOption)}
          >
            { appConfig.storageOptions!.map(option => <MenuItem
              value={option.storage} key={option.storage}>
                { option.name }</MenuItem>) }
          </Select>
          { storageOptionVal ? <Typography className="trmrk-caption" onClick={handleAuthorizeStorage}>
            <Button className="trmrk-main-btn">Authorize</Button> {
              [
                "Turmerik Notes to use",
                storageOptionVal.name,
                "to store your notes",
              ].join(" ") } 
          </Typography> : null }
          { storageOption ? <Typography className="trmrk-caption" onClick={onPickFilesRootLocationClick}>
            <Button className="trmrk-main-btn">Pick</Button> {
              [
                "a location on your",
                storageOption!.name,
                "where your notes will be stored"
              ].join(" ") } 
          </Typography> : null }
        </FormControl>
        { error ? <ErrorEl errCaption={"No location for your notes"} errMessage={error.message?.toString() ?? "Something went wrong"} /> : null }
      </Box>
    </ContainerEl>);
  }
};
