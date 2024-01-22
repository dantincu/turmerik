import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";

import { setCurrentRoutePathName, getCurrentRoutePathName } from "../../store/appDataSlice";
import { routes } from "../../services/routes";

export default function DataRecordsListPage({
  }: {
  }) {
  const dispatch = useDispatch();
  const currentRoutePathName = useSelector(getCurrentRoutePathName);

  useEffect(() => {
    if (currentRoutePathName !== routes.datarecordsRoot.pathname) {
      dispatch(setCurrentRoutePathName(routes.datarecordsRoot.pathname));
    }
  }, []);

  return (<Box className="trmrk-page trmrk-datarecords-list-page"></Box>);
}
