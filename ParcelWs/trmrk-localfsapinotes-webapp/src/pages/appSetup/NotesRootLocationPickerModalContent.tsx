import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

import NorthWestIcon from "@mui/icons-material/NorthWest";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { getRootedPathSegments } from "trmrk-browser/src/DriveExplorerApi/core";

import { AppData } from "../../services/appData";
import CharIcon from "../../components/iconButtons/CharIcon";
import { FloatingBarTopOffset } from "../../services/htmlDoc/floatingBarTopOffsetUpdater";

import FilesHcy from "../../components/filesHcy/FilesHcy";
import { setHasFilesRootLocation, setHasNotesRootLocation } from "../../store/appDataSlice";

const offset: FloatingBarTopOffset = {
  showHeader: null,
  headerIsHidden: false,
  appBarHeight: null,
  lastBodyScrollTop: 0,
  lastHeaderTopOffset: 0
}

export default function NotesRootLocationPickerModalContent({
    onModalClose
  }: {
    onModalClose: () => void
  }) {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const dispatch = useDispatch();
  
  const [ editAddressBar, setEditAddressBar ] = useState(false);

  const headerElRef = useRef<HTMLDivElement | null>(null);
  const bodyElRef = useRef<HTMLDivElement | null>(null);
  const textAddressElRef = useRef<HTMLInputElement | null>(null);

  const [ currentPath, setCurrentPath ] = useState("");
  const [ editedPath, setEditedPath ] = useState("");

  const onAddressInputClick = () => {
    if (!editAddressBar) {
      setEditAddressBar(true);
      textAddressElRef.current?.getElementsByTagName("input")[0]?.select();
    }
  }

  const onAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPath(e.currentTarget.value);
  }

  const onAddressEditSubmit = () => {
    setCurrentPath(editedPath);
    setEditAddressBar(false);
  }

  const onAddressEditCancel = () => {
    setEditedPath(currentPath);
    setEditAddressBar(false);
  }

  const onRootFolderIconClick = () => {
    setCurrentPath("");
    setEditedPath("");
  }

  const onAddressSelect = () => {
    dispatch(setHasNotesRootLocation(true));
  }

  const onUpdateFloatingBarTopOffset = () => {
    const headerEl = headerElRef.current;
    const bodyEl = bodyElRef.current;

    if (headerEl && bodyEl) {
      offset.appBarHeight = parseInt(getComputedStyle(headerEl, "").height);

      const bodyScrollTop = bodyEl.scrollTop;
      const bodyScrollTopDiff = bodyScrollTop - offset.lastBodyScrollTop;

      const headerTopOffset = Math.max(
        offset.lastHeaderTopOffset - bodyScrollTopDiff,
        -1 * offset.appBarHeight
      );

      offset.lastBodyScrollTop = bodyScrollTop;
      offset.lastHeaderTopOffset = Math.min(0, headerTopOffset);

      headerEl.style.top = offset.lastHeaderTopOffset + "px";
      bodyEl.style.top =
        offset.lastHeaderTopOffset + offset.appBarHeight + "px";
    }
  }

  const onUserScroll = () => {
    onUpdateFloatingBarTopOffset();
  }

  const onResize = () => {
    offset.showHeader = true;
    onUpdateFloatingBarTopOffset();
  }

  const pickNotesRootLocModalStyle = {
    position: 'absolute',
    top: '0px', left: '0px', right: '0px', bottom: '0px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    bodyElRef.current!.addEventListener("scroll", onUserScroll);
    window.addEventListener("resize", onResize);

    return () => {
      bodyElRef.current?.removeEventListener("scroll", onUserScroll);
      window.removeEventListener("resize", onResize);
    }
  }, [ headerElRef, bodyElRef ]);

  return (<Box sx={pickNotesRootLocModalStyle} className="trmrk-app-setup-modal-content">
      <Box className="trmrk-header" ref={headerElRef} sx={{ height: "6em" }}>
        <IconButton className="trmrk-close-btn" onClick={onModalClose}>
          <CharIcon
            fontSize="1.8em" lineHeight="0.5">&times;</CharIcon>
        </IconButton>
        <Typography variant="h6" component="h2">
          Choose a default location for your notes
        </Typography>
        <Box className="trmrk-address-bar" sx={{ }}>
          <Box className={[
                "trmrk-text-input",
                editAddressBar ? "trmrk-edit-input" : "trmrk-readonly-input"
              ].join(" ")}>
            { editAddressBar ? <IconButton
              className="trmrk-cancel-edit-icon" onClick={onAddressEditCancel}><NorthWestIcon /></IconButton> : <IconButton
              className="trmrk-root-folder-icon" onClick={onRootFolderIconClick}><CharIcon css="">{"/"}</CharIcon></IconButton> }
            <Input type="text" readOnly={!editAddressBar} ref={textAddressElRef} sx={{
              position: "absolute",
              left: editAddressBar ? "2em" : "2em",
              right: editAddressBar ? "2em" : "2em" }} onClick={onAddressInputClick}
              value={editAddressBar ? editedPath : currentPath } onChange={onAddressChange} />
            { editAddressBar ? <IconButton
              className="trmrk-submit-edit-icon" onClick={onAddressEditSubmit}><ArrowForwardIosIcon /></IconButton> : <Button
              className="trmrk-folder-choose-btn" onClick={onAddressSelect}>Select Folder</Button> }
          </Box>
        </Box>
      </Box>
      <Box className="trmrk-container trmrk-scrollable" ref={bodyElRef}>
        <Box className="trmrk-content" sx={{ height: "200vh" }}>
        </Box>
      </Box>
    </Box>);
}
