import React from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";

import { EditedDbObjectStore, normalizeKeyPath } from "../../services/indexedDbData";

export default function ExistingDatastore({
    dataStore,
    className,
    isEditable,
    datastoreClick,
    datastoreDelete
  }: {
    dataStore: EditedDbObjectStore,
    className?: string | null | undefined,
    isEditable?: boolean | null | undefined,
    datastoreClick?: ((store: EditedDbObjectStore) => void) | null | undefined,
    datastoreDelete?: ((store: EditedDbObjectStore) => void) | null | undefined
  }) {

  const onDatastoreClick = datastoreClick ?? ((dataStore) => {});
  const onDatastoreDelete = datastoreDelete ?? ((dataStore) => {});

  const normKeyPath = normalizeKeyPath(dataStore.keyPath);

  return (<li className={["trmrk-page-list-item",
          dataStore.isDeleted ? "trmrk-deleted-item" : null,
          className  ?? null].join(" ")}
        onClick={() => onDatastoreClick(dataStore)}>
      <Box className={["trmrk-item-label"].join(" ")}>
        { dataStore.storeName }
      </Box>
      <Box className="trmrk-item-summary">
        <Box className="trmrk-summary-item">
          <span className="trmrk-name">Auto Increment:</span>
          <span className="trmrk-value">{ dataStore.autoIncrement ? "true" : "false" }</span>
        </Box>
        <Box className="trmrk-summary-item">
          <span className="trmrk-name">Key Path:</span>
          { normKeyPath.map(keyPath => <span className="trmrk-value trmrk-value-multiple">{ keyPath }</span>) }
        </Box>
      </Box>
      { isEditable ? <Box className="trmrk-item-action-buttons">
          <IconButton className="trmrk-icon-button"
              onClick={() => onDatastoreDelete(dataStore!)}>
            { dataStore.isDeleted ? <RestoreFromTrashIcon /> : <DeleteIcon className="trmrk-delete-icon" /> }
          </IconButton>
        </Box> : null }
    </li>);
}
