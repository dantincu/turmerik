import * as React from 'react';
import Paper from '@mui/material/Paper';

import LoadingDotPulse from '../loading/LoadingDotPulse';
import TrmrkTreeNodesList from './TrmrkTreeNodesList';
import TrmrkTreeNode, { TrmrkTreeNodeClickLocation } from './TrmrkTreeNode';
import { TrmrkTreeNodeState } from './TreeNodeState';

export interface IndexedDbTrmrkTreeNodeData {
  dbInfo: IDBDatabaseInfo;
}

export interface IndexedDbBrowserProps {
}

export default function IndexedDbBrowser(
  props: IndexedDbBrowserProps) {

  const [ isLoadingRoot, setIsLoadingRoot ] = React.useState(false);

  const [ databases, setDatabases ] = React.useState<TrmrkTreeNodeState<IndexedDbTrmrkTreeNodeData>[] | null>(null);
  const [ error, setError ] = React.useState<Error | any | null>(null);

  const loadDatabases = () => {
    setIsLoadingRoot(true);
    indexedDB.databases().then(databases => {
      databases.sort((a, b) => a.name!.localeCompare(b.name!));

      const databasesArr = databases.map((db, idx) => ({
        key: db.name ?? idx,
        nodeLabel: db.name ?? "",
        isExpanded: false,
        isCurrent: false,
        idx: idx,
        lvlIdx: 0,
        data: {
          dbInfo: db
        },
      }));

      setDatabases(databasesArr);
    }, reason => {
      setError(reason);
    }).finally(() => {
      setIsLoadingRoot(false);
    });
  }

  const dbNodeClicked = (state: TrmrkTreeNodeState<IndexedDbTrmrkTreeNodeData>, location: TrmrkTreeNodeClickLocation) => {
    const databasesArr = databases!.map(db => ({
      ...db,
      isCurrent: db.key === state.key
    }) as TrmrkTreeNodeState<IndexedDbTrmrkTreeNodeData>);

    setDatabases(databasesArr);
  }

  React.useEffect(() =>{
    if (!databases && !error) {
      loadDatabases();
    } else {
      console.log("current databases", databases!.filter(st => st.isCurrent).map(st => st.key));
    }
  }, [ isLoadingRoot, databases, error ]);

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
      nodeFactory={data => <TrmrkTreeNode className="trmrk-indexeddb-tree-node" state={data} key={data.key} nodeClicked={dbNodeClicked}
        iconNodeEl={<span className="trmrk-icon trmrk-icon-database material-symbols-outlined">database</span>} />}
      loadingNodeFactory={() => <LoadingDotPulse parentElTagName={"li"} />}>
    </TrmrkTreeNodesList> : null }
  </div>);
}
