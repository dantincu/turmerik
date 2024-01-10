import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";

import { core as trmrk } from "trmrk";
import { DriveItem, FileType, OfficeFileType } from "trmrk/src/drive-item"

import { IDriveExplorerApi } from "trmrk-browser/src/DriveExplorerApi/core";

import FilesHcyNodesList from "./FilesHcyNodesList";
import LoadingDotPulse from "../loading/DotPulse";

export default function FilesHcy({
    driveExplorerSvc,
    className
  }: {
    driveExplorerSvc: IDriveExplorerApi,
    className?: string | null | undefined
  }) {
    const [ folderNode, setFolderNode ] = useState<DriveItem | null>(null);
    const [ error, setError ] = useState<Error | null>(null);

    const onRootFolderResponse = (
      folder: DriveItem | null, error: Error | any | null) => {
        if (folder) {
          setFolderNode(folder);
        } else {
          error ??= Error("Could not load the root folder");
          setError(error);
        }
    }

    useEffect(() => {
      driveExplorerSvc.GetFolder({
        path: ""
      }).then(folder => {
        onRootFolderResponse(folder, null);
      }, reason => {
        onRootFolderResponse(null, reason);
      });
    }, [ folderNode, error ]);

    className ??= null;

    return (<Box className={["trmrk-files-hcy", className].join(" ")}>
      { folderNode ? error ? <Box className="trmrk-error">
        { error.message ?? error.cause ?? "Could not load the root folder" }</Box> : <FilesHcyNodesList
        driveExplorerSvc={driveExplorerSvc} parentFolder={folderNode} isRootFolder={true}></FilesHcyNodesList> : <LoadingDotPulse />}
    </Box>);
}
