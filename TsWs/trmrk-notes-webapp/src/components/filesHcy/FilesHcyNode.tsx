import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";

import trmrk from "trmrk";
import { ValueOrError } from "trmrk/src/core";

import { DriveItem, FileType, OfficeFileType } from "trmrk/src/drive-item"

import { IDriveExplorerApi } from "trmrk/src/DriveExplorerApi/core";

import LoadingDotPulse from "../loading/DotPulse";

export default function FilesHcyNodesList({
    driveExplorerSvc,
    driveItem,
    isFolder,
    className
  }: {
    driveExplorerSvc: IDriveExplorerApi,
    driveItem: DriveItem,
    isFolder: boolean,
    className?: string | null | undefined
  }) {
    className ??= null;

  return (<li key={driveItem.name} className={["trmrk-node", isFolder ? "trmrk-folder" : "trmrk-file",
        className ].join(" ")}>
          {driveItem.name}
      </li>);
}
