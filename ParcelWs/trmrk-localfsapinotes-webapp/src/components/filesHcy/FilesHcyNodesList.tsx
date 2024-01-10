import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";

import { core as trmrk } from "trmrk";
import { ValueOrError } from "trmrk/src/core";

import { DriveItem, FileType, OfficeFileType } from "trmrk/src/drive-item"

import { IDriveExplorerApi } from "trmrk-browser/src/DriveExplorerApi/core";

import LoadingDotPulse from "../loading/DotPulse";
import FilesHcyNode from "./FilesHcyNode";

export default function FilesHcyNodesList({
    driveExplorerSvc,
    parentFolder,
    isRootFolder,
    className
  }: {
    driveExplorerSvc: IDriveExplorerApi,
    parentFolder: DriveItem,
    isRootFolder?: boolean | null | undefined,
    className?: string | null | undefined
  }) {
    className ??= null;

  return (<ul className={["trmrk-nodes-list", isRootFolder ? "trmrk-root-nodes-list" : null, className].join(" ")}>
      { parentFolder.subFolders.map(folder => <FilesHcyNode key={folder.name} isFolder={true}
          driveExplorerSvc={driveExplorerSvc} driveItem={folder} /> ) }

      { parentFolder.folderFiles.map(file => <FilesHcyNode key={file.name} isFolder={false}
          driveExplorerSvc={driveExplorerSvc} driveItem={file} />) }
    </ul>);
}
