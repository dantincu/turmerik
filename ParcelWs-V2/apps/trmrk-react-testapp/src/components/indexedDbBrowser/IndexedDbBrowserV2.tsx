import * as React from 'react';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import LoadingDotPulse from '../loading/LoadingDotPulse';
import TrmrkTreeNodesList from './TrmrkTreeNodesList';
import TrmrkTreeNode, { TrmrkTreeNodeClickLocation } from './TrmrkTreeNode';
import { TrmrkTreeNodeData } from './TrmrkTreeNodeData';

export interface IndexedDbTrmrkTreeNodeDataValue {
  dbInfo: IDBDatabaseInfo;
}

export interface IndexedDbBrowserProps {
}

export default function IndexedDbBrowser(
  props: IndexedDbBrowserProps) {

  const [ isLoadingRoot, setIsLoadingRoot ] = React.useState(false);

  const [ databases, setDatabases ] = React.useState<TrmrkTreeNodeData<IndexedDbTrmrkTreeNodeDataValue>[] | null>(null);
  const [ error, setError ] = React.useState<Error | any | null>(null);

  const [ isDbMenuOpen, setIsDbMenuOpen ] = React.useState(false);
  const currentDbLabelRef = React.useRef<HTMLDivElement | null>(null);

  const loadDatabases = () => {
    setIsLoadingRoot(true);
    indexedDB.databases().then(databases => {
      databases.sort((a, b) => a.name!.localeCompare(b.name!));

      const databasesArr = databases.map((db, idx) => ({
        key: db.name ?? idx,
        nodeLabel: db.name ?? "",
        idx: idx,
        lvlIdx: 0,
        value: {
          dbInfo: db
        },
      }) as TrmrkTreeNodeData<IndexedDbTrmrkTreeNodeDataValue>);

      setDatabases(databasesArr);
    }, reason => {
      setError(reason);
    }).finally(() => {
      setIsLoadingRoot(false);
    });
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

  const onDbMenuClose = () => {
    setIsDbMenuOpen(false);
  }

  React.useEffect(() =>{
    if (!databases && !error) {
      loadDatabases();
    } else {
      // console.log("databases", databases!.filter(db => db.isCurrent).map(db => db.key));
    }
  }, [ isLoadingRoot, databases, error, isDbMenuOpen, currentDbLabelRef ]);

  return (<div className="trmrk-panel trmrk-indexeddb-browser">
    <Paper className={['trmrk-pinned-top-bar', "trmrk-current-node-hcy", isLoadingRoot ? "trmrk-is-loading" : "" ].join(" ")}>
      <span className='trmrk-hcy-root-node-token'>&#47;</span>
      { isLoadingRoot ? <LoadingDotPulse /> : null }
    </Paper>
    <div className={['trmrk-pinned-top-bar-bg-spacer', isLoadingRoot ? "trmrk-is-loading" : "" ].join(" ")}>
    </div>
    { databases ? <TrmrkTreeNodesList
      className="trmrk-indexeddb-tree-view"
      dataArr={databases ?? []}
      isLoading={isLoadingRoot}
      nodeFactory={data => <TrmrkTreeNode className="trmrk-indexeddb-tree-node" data={data} key={data.key} nodeClicked={dbNodeClicked}
        iconNodeEl={<span className="trmrk-icon trmrk-icon-database material-symbols-outlined">database</span>} />}
      loadingNodeFactory={() => <LoadingDotPulse parentElTagName={"li"} />}>
    </TrmrkTreeNodesList> : null }
    <Menu className="trmrk-menu"
        open={isDbMenuOpen}
        anchorEl={currentDbLabelRef.current}
        onClose={onDbMenuClose}>
      <MenuList className='trmrk-menu-list'>
        <MenuItem>
          <IconButton><EditIcon /></IconButton>
          <IconButton><MoreVertIcon /></IconButton>
          <IconButton><ArrowForwardIcon /></IconButton>
        </MenuItem>
      </MenuList>
    </Menu>
  </div>);
}
