import React, { useEffect, useRef, useState } from "react";

import { Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import { appRoutes } from "../services/routes";

import TrmrkAppBar from "../components/appBar/TrmrkAppBar";
import NotFoundPage from "../pages/notFound/NotFoundPage";
import DatabasePage from "../pages/Databases/DatabasePage";
import DatabasesListPage from "../pages/Databases/DatabasesListPage";
import DataStorePage from "../pages/DataStores/DataStorePage";
import DataRecordPage from "../pages/DataRecords/DataRecordPage";
import DataRecordsListPage from "../pages/DataRecords/DataRecordsListPage";

export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <TrmrkAppBar />
      <Box className="trmrk-main-content" sx={{ marginTop: "3em" }}>
        <Routes>
          <Route path="" element={<Navigate to={appRoutes.databasesRoot} />} />
          <Route path="/" element={<Navigate to={appRoutes.databasesRoot} />} />
          <Route path={appRoutes.database} element={<DatabasePage showDataStoresListDetails={false} />} />
          <Route path={appRoutes.databasesRoot} Component={DatabasesListPage} />
          <Route path={appRoutes.datastore} Component={DataStorePage} />
          <Route path={appRoutes.datastoresRoot} element={<DatabasePage showDataStoresListDetails={true} />} />
          <Route path={appRoutes.datarecord} Component={DataRecordPage} />
          <Route path={appRoutes.datarecordsRoot} Component={DataRecordsListPage} />
          <Route path="*" Component={NotFoundPage} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}
