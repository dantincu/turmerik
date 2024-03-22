import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import HeightIcon from '@mui/icons-material/Height';

import trmrk from "trmrk";

import LoadingDotPulse from '../loading/LoadingDotPulse';
import TrmrkTreeNodesList from './TrmrkTreeNodesList';
import TrmrkTreeNode from './TrmrkTreeNode';
import { TrmrkTreeNodeData, TrmrkTreeNodeClickLocation } from './TrmrkTreeNodeData';

import { getDbInfo, IDbDatabaseInfo, IDbObjectStoreInfo } from "../../services/indexedDb";
import { IndexedDbStoreTrmrkTreeNodeDataValue, IndexedDbTrmrkTreeNodeDataValue } from "./data";
import IndexedDbTreeNode, { IndexedDbTreeNodeProps } from "./IndexedDbTreeNode";

export interface IndexedDbBrowserProps {
}

export default function IndexedDbBrowser(
  props: IndexedDbBrowserProps) {

  const [ isLoadingRoot, setIsLoadingRoot ] = React.useState(false);

  const [ databases, setDatabases ] = React.useState<TrmrkTreeNodeData<IndexedDbTrmrkTreeNodeDataValue>[] | null>(null);
  const [ error, setError ] = React.useState<Error | any | null>(null);

  const [ isPinnedTopBarMenuOpen, setIsPinnedTopBarMenuOpen ] = React.useState(false);
  const [ isDbMenuOpen, setIsDbMenuOpen ] = React.useState(false);

  const pinnedTopBarRef = React.useRef<HTMLButtonElement | null>(null);
  const currentDbLabelRef = React.useRef<HTMLDivElement | null>(null);

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

  React.useEffect(() =>{
    if (!databases && !error) {
      loadDatabases();
    } else {
      // console.log("databases", databases!.filter(db => db.isCurrent).map(db => db.key));
    }
  }, [ isLoadingRoot, databases, error, isPinnedTopBarMenuOpen, isDbMenuOpen, pinnedTopBarRef, currentDbLabelRef ]);

  return (<div className="trmrk-panel trmrk-indexeddb-browser">
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
      <MenuList className='trmrk-menu-list'>
        <MenuItem>
          <IconButton><HeightIcon /></IconButton>
        </MenuItem>
      </MenuList>
    </Menu>
    <Menu className="trmrk-menu"
        open={isDbMenuOpen}
        anchorEl={currentDbLabelRef.current}
        onClose={onDbMenuClose}>
      <MenuList className='trmrk-menu-list'>
        <MenuItem>
          <IconButton><VisibilityIcon /></IconButton>
          <IconButton><EditIcon /></IconButton>
          <IconButton><MoreVertIcon /></IconButton>
          <IconButton><ArrowForwardIcon /></IconButton>
        </MenuItem>
      </MenuList>
    </Menu>
  </div>);
}
