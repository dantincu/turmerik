import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { DataGrid, GridColDef, GridRowParams, GridActionsCellItem } from '@mui/x-data-grid';



export interface FoldersPageProps {
}

import AppBarsPagePanel from "../../../../../trmrk-react/components/barsPanel/AppBarsPagePanel";

import { appBarSelectors, appBarReducers } from "../../../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../../../store/appDataSlice";

import { getAppTheme } from "../../../../../trmrk-react/app-theme/core";

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    resizable: false,
    // disableReorder: true
  },
  {
    type: "actions",
    headerName: "",
    width: 40,
    field: "",
    getActions: (params: GridRowParams) => [
      <GridActionsCellItem icon={<MoreVertIcon />} label="" />
    ]
  }
];

const rows = [
  { id: 1, name: 'Snow asdfasdfasfd asdfasdfasfd asdfasdfasfd asdfasdfasfd asdfasdfasfd asdfasdfasfd' },
  { id: 2, name: 'Lannister' },
  { id: 3, name: 'Lannister' },
  { id: 4, name: 'Stark' },
  { id: 5, name: 'Targaryen' },
  { id: 6, name: 'Melisandre' },
  { id: 7, name: 'Clifford' },
  { id: 8, name: 'Frances' },
  { id: 9, name: 'Roxie' },
];

export default function FoldersPage(props: FoldersPageProps) {
  const [ urlSearchParams, setUrlSearchParams ] = useSearchParams();

  const isCompactMode = useSelector(appDataSelectors.getIsCompactMode);
  const isDarkMode = useSelector(appDataSelectors.getIsDarkMode);

  const appTheme = React.useMemo(
    () => getAppTheme({
      isDarkMode: isDarkMode,
    }), [isDarkMode]
  );

  React.useEffect(() => {
  }, [
    urlSearchParams,
    isCompactMode,
    isDarkMode,
    appTheme ]);

  return (<AppBarsPagePanel
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}>
    <Box sx={{ height: "100%", width: '100%' }}>
      <DataGrid className="trmrk-mui-datagrid"
        rows={rows}
        columnHeaderHeight={40}
        rowHeight={40}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50,
            },
          },
        }}
        pageSizeOptions={[25, 50, 100]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  </AppBarsPagePanel>);
}
