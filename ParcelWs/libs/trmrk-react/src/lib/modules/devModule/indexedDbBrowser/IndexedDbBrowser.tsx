import * as React from 'react';
import { useNavigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowForward from '@mui/icons-material/ArrowForward';
import HeightIcon from '@mui/icons-material/Height';

import trmrk from "../../../../trmrk";

import MatUIIcon from "../../../components/icons/MatUIIcon";
import LoadingDotPulse from '../../../components/loading/LoadingDotPulse';
import TrmrkTreeNodesList from '../../../components/treeNodes/TrmrkTreeNodesList';
import { TrmrkTreeNodeData, TrmrkTreeNodeClickLocation } from '../../../components/treeNodes/TrmrkTreeNodeData';

import { getDbInfo, IDbDatabaseInfo, IDbObjectStoreInfo } from "../../../services/indexedDb";
import { IndexedDbStoreTrmrkTreeNodeDataValue, IndexedDbTrmrkTreeNodeDataValue, searchQuery } from "./data";
import IndexedDbTreeNode, { IndexedDbTreeNodeProps } from "./IndexedDbTreeNode";

import { AppBarSelectors, AppBarReducers } from "../../../redux/appBarData";
import { AppDataSelectors, AppDataReducers } from "../../../redux/appData";

import AppBarsPanel from "../../../components/barsPanel/AppBarsPanel";

export interface IndexedDbBrowserProps {
  basePath: string;
  rootPath: string;
  appBarSelectors: AppBarSelectors;
  appBarReducers: AppBarReducers;
  appDataSelectors: AppDataSelectors;
  appDataReducers: AppDataReducers;
}

export default function IndexedDbBrowser(
  props: IndexedDbBrowserProps) {

  const [ isLoadingRoot, setIsLoadingRoot ] = React.useState(false);

  const [ databases, setDatabases ] = React.useState<TrmrkTreeNodeData<IndexedDbTrmrkTreeNodeDataValue>[] | null>(null);
  const [ error, setError ] = React.useState<Error | any | null>(null);

  const [ isPinnedTopBarMenuOpen, setIsPinnedTopBarMenuOpen ] = React.useState(false);
  const [ currentDb, setCurrentDb ] = React.useState<TrmrkTreeNodeData<IndexedDbTrmrkTreeNodeDataValue> | null>(null);
  const [ isDbMenuOpen, setIsDbMenuOpen ] = React.useState(false);

  const pinnedTopBarRef = React.useRef<HTMLButtonElement | null>(null);
  const currentDbLabelRef = React.useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const loadDatabases = () => {
    setIsLoadingRoot(true);

    indexedDB.databases().then(databases => {
      databases.sort((a, b) => a.name!.localeCompare(b.name!));

      const databasesArr = databases.map((db, idx): TrmrkTreeNodeData<IndexedDbTrmrkTreeNodeDataValue> => ({
        key: db.name ?? idx,
        nodeLabel: db.name ?? "",
        idx: idx,
        lvlIdx: 0,
        value: {
          dbInfo: getDbInfo(db),
        },
      }));

      setDatabases(databasesArr);
    }, reason => {
      setError(reason);
    }).finally(() => {
      setIsLoadingRoot(false);
    });
  }

  const pinnedTopBarOptionsClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    pinnedTopBarRef.current = e.target as HTMLButtonElement;
    setIsPinnedTopBarMenuOpen(true);
  }

  const dbNodeClicked = (
      data: TrmrkTreeNodeData<IndexedDbTrmrkTreeNodeDataValue>,
      labelEl: HTMLDivElement,
      location: TrmrkTreeNodeClickLocation) => {
    const databasesArr = databases!.map(db => ({
      ...db,
      isCurrent: (db.key === data.key) ? true : false
    }) as TrmrkTreeNodeData<IndexedDbTrmrkTreeNodeDataValue>);

    setDatabases(databasesArr);
    currentDbLabelRef.current = labelEl;
    setIsDbMenuOpen(true);
    setCurrentDb(databasesArr.find(db => db.key === data.key)!);
  }

  const currentDbNodeExpandToggleClicked = () => {
    if (currentDb) {
      const databasesArr = databases!.map(db => ({
        ...db,
        isExpanded: (db.key === currentDb.key) ? !currentDb.isExpanded : db.isExpanded
      }) as TrmrkTreeNodeData<IndexedDbTrmrkTreeNodeDataValue>);
    
      setDatabases(databasesArr);

      setCurrentDb({
        ...currentDb,
        isExpanded: !currentDb.isExpanded
      });
    
      setIsDbMenuOpen(false);
    }
  }

  const currentDbNodeGoToClicked = () => {
    if (currentDb) {
      const encodedDbName = encodeURIComponent(currentDb.value.dbInfo.name ?? "");
      navigate(`${props.basePath}/edit-db?${searchQuery.dbName}=${encodedDbName}`);
    }
  }

  const dbExpandedToggled = (data: TrmrkTreeNodeData<IndexedDbTrmrkTreeNodeDataValue>) => {
    const databasesArr = databases!.map(db => ({
      ...db,
      isExpanded: (db.key === data.key) ? data.isExpanded : db.isExpanded
    }) as TrmrkTreeNodeData<IndexedDbTrmrkTreeNodeDataValue>);

    setDatabases(databasesArr);
  }

  const onPinnedTopBarMenuClose = () => {
    setIsPinnedTopBarMenuOpen(false);
  }

  const onDbMenuClose = () => {
    setIsDbMenuOpen(false);
  }

  const goToCreateDb = () => {
    navigate(`${props.basePath}/create-db`);
  }

  React.useEffect(() =>{
    if (!databases && !error) {
      loadDatabases();
    } else {
      // console.log("databases", databases!.filter(db => db.isCurrent).map(db => db.key));
    }
  }, [ isLoadingRoot,
    databases,
    error,
    isPinnedTopBarMenuOpen,
    isDbMenuOpen,
    pinnedTopBarRef,
    currentDbLabelRef,
    currentDb,
    currentDb?.isExpanded ]);

  return (<AppBarsPanel basePath={props.rootPath}
      appBarSelectors={props.appBarSelectors}
      appBarReducers={props.appBarReducers}
      appDataSelectors={props.appDataSelectors}
      appDataReducers={props.appDataReducers}
      appHeaderChildren={<React.Fragment>
        <IconButton onClick={goToCreateDb}><MatUIIcon className="trmrk-icon trmrk-icon-database" iconName="database" /></IconButton>
        <Typography variant="h4" component="h1" className="trmrk-page-title">IndexedDb</Typography>
        </React.Fragment>}>
    <div className="trmrk-panel-content trmrk-indexeddb-browser">
      <Paper className={['trmrk-pinned-top-bar', "trmrk-current-node-hcy", isLoadingRoot ? "trmrk-is-loading" : "" ].join(" ")}>
        <IconButton ref={pinnedTopBarRef} onClick={pinnedTopBarOptionsClicked}><SettingsIcon /></IconButton>
      </Paper>
      <div className={['trmrk-pinned-top-bar-bg-spacer', isLoadingRoot ? "trmrk-is-loading" : "" ].join(" ")}>
      </div>
      { databases ? <TrmrkTreeNodesList
        className="trmrk-indexeddb-tree-view"
        dataArr={databases ?? []}
        isLoading={isLoadingRoot}
        hasError={!!error}
        error={error}
        nodeFactory={data => <IndexedDbTreeNode data={data} key={data.key}
          nodeClicked={dbNodeClicked} expandedToggled={dbExpandedToggled}>
          </IndexedDbTreeNode>}
        loadingNodeFactory={() => <LoadingDotPulse parentElTagName={"li"} />}
        errorNodeFactory={error => <div className='trmrk-error'>{ trmrk.errToString(error) ?? "Something went wrong" }</div>}>
      </TrmrkTreeNodesList> : null }
      <Menu className="trmrk-menu"
          open={isPinnedTopBarMenuOpen}
          anchorEl={pinnedTopBarRef.current}
          onClose={onPinnedTopBarMenuClose}>
        <Box className="trmrk-icons-menu-list">
          <IconButton><HeightIcon /></IconButton>
        </Box>
      </Menu>
      <Menu className="trmrk-menu"
          open={isDbMenuOpen}
          anchorEl={currentDbLabelRef.current}
          onClose={onDbMenuClose}>
          {currentDb ? <Box className="trmrk-icons-menu-list">
            <IconButton onClick={currentDbNodeExpandToggleClicked}> { currentDb.isExpanded ? <ArrowDropDownIcon /> : <ArrowRightIcon /> } </IconButton>
            <IconButton onClick={currentDbNodeGoToClicked}><ArrowForward /></IconButton>
          </Box> : null }
      </Menu>
    </div>
  </AppBarsPanel>);
}
