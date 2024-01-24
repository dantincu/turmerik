import React, { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";

import { IDbObjectStoreInfo } from "../../services/indexedDb";
import { EditedDbObjectStore } from "../../services/indexedDbData";

import ExistingDatastore from "./ExistingDatastore";

export default function ExistingDataStoresList({
    dbStores,
    className,
    isEditable,
    datastoreClick,
    datastoreDelete
  }: {
    dbStores: EditedDbObjectStore[]
    className?: string | null | undefined,
    isEditable?: boolean | null | undefined,
    datastoreClick?: (store: EditedDbObjectStore) => void,
    datastoreDelete?: (store: EditedDbObjectStore) => void
  }) {
  return (<ul className={["trmrk-page-list trmrk-existing-datastores-list",
        isEditable ? "trmrk-editable-list" : null,
        className ?? null].join(" ")}>
      { dbStores.map(dataStore =>
        <ExistingDatastore
          key={dataStore.storeName}
          isEditable={isEditable}
          dataStore={dataStore as EditedDbObjectStore}
          datastoreClick={datastoreClick}
          datastoreDelete={datastoreDelete} />) }
    </ul>);
}
