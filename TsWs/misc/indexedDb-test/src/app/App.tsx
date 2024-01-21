import React, { useEffect, useRef, useState } from "react";

import { Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux'
import styled from '@emotion/styled';

import CssBaseline from "@mui/material/CssBaseline";
import Checkbox  from "@mui/material/Checkbox";
import FormControlLabel  from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import { appRoutes } from "../services/routes";

import NotFoundPage from "../pages/notFound/NotFoundPage";
import DatabasePage from "../pages/Databases/DatabasePage";
import DatabasesListPage from "../pages/Databases/DatabasesListPage";
import DataStorePage from "../pages/DataStores/DataStorePage";
import DataStoresListPage from "../pages/DataStores/DataStoresListPage";
import DataRecordPage from "../pages/DataRecords/DataRecordPage";
import DataRecordsListPage from "../pages/DataRecords/DataRecordsListPage";

export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="" element={<Navigate to="/databases" />} />
        <Route path="/" element={<Navigate to="/databases" />} />
        <Route path={appRoutes.databases} Component={DatabasePage} />
        <Route path={appRoutes.databasesRoot} Component={DatabasesListPage} />
        <Route path={appRoutes.datastores} Component={DataStorePage} />
        <Route path={appRoutes.datastoresRoot} Component={DataStoresListPage} />
        <Route path={appRoutes.datarecords} Component={DataRecordPage} />
        <Route path={appRoutes.datarecordsRoot} Component={DataRecordsListPage} />
        <Route path="*" Component={NotFoundPage} />
      </Routes>
    </BrowserRouter>
  );
}
