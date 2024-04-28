import React from "react";

import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import trmrk from "../../synced-libs/trmrk";
import MatUIIcon from "../../synced-libs/trmrk-react/components/icons/MatUIIcon";

import LoadingDotPulse from '../../../components/loading/LoadingDotPulse';
import TrmrkTreeNodesList from './TrmrkTreeNodesList';
import TrmrkTreeNode, { TrmrkTreeNodeProps } from './TrmrkTreeNode';
import TrmrkTreeNodeLeaf, { TrmrkTreeNodeLeafProps } from './TrmrkTreeNodeLeaf';
import { TrmrkTreeNodeData, TrmrkTreeNodeClickLocation } from './TrmrkTreeNodeData';
import { IndexedDbStoreTrmrkTreeNodeDataValue, IndexedDbTrmrkTreeNodeDataValue } from "./data";
import { attachDefaultHandlersToDbOpenRequest, getObjectStoresInfoAgg, getErrMsg, dfDatabaseOpenErrMsg } from "../../../services/indexedDb";

export interface IndexedDbTreeNodeProps {
  data: TrmrkTreeNodeData<IndexedDbTrmrkTreeNodeDataValue>;
  expandedToggled: (data: TrmrkTreeNodeData<IndexedDbTrmrkTreeNodeDataValue>) => void;
  nodeClicked: (data: TrmrkTreeNodeData<IndexedDbTrmrkTreeNodeDataValue>, labelEl: HTMLDivElement, location: TrmrkTreeNodeClickLocation) => void;
}

export default function IndexedDbTreeNode(
  props: IndexedDbTreeNodeProps
) {
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ dbStores, setDbStores ] = React.useState<TrmrkTreeNodeData<IndexedDbStoreTrmrkTreeNodeDataValue>[] | null>(null);
  const [ error, setError ] = React.useState<Error | any | null>(null);
  const [ warning, setWarning ] = React.useState<Error | any | null>(null);

  const [ isDbStoreMenuOpen, setIsDbStoreMenuOpen ] = React.useState(false);
  const currentDbStoreLabelRef = React.useRef<HTMLDivElement | null>(null);

  const onDbStoreMenuClose = () => {
    setIsDbStoreMenuOpen(false);
  }

  const dbStoreNodeClicked = (
      data: TrmrkTreeNodeData<IndexedDbStoreTrmrkTreeNodeDataValue>,
      labelEl: HTMLDivElement,
      location: TrmrkTreeNodeClickLocation) => {
    const dbStoresArr = dbStores!.map(dbStore => ({
      ...dbStore,
      isCurrent: (dbStore.key === data.key) ? true : false
    }) as TrmrkTreeNodeData<IndexedDbStoreTrmrkTreeNodeDataValue>);

    setDbStores(dbStoresArr);
    currentDbStoreLabelRef.current = labelEl;
    setIsDbStoreMenuOpen(true);
  }

  const loadDbStores = () => {
    setIsLoading(true);
    var req = indexedDB.open(props.data.value.dbInfo.name!);

    attachDefaultHandlersToDbOpenRequest(req, dfDatabaseOpenErrMsg, success => { 
      setIsLoading(false);

      if (success) {
        const db = req.result;
        
        try {
          const objStores = getObjectStoresInfoAgg(db);

          const dbStores = objStores.map((obj, idx): TrmrkTreeNodeData<IndexedDbStoreTrmrkTreeNodeDataValue> => ({
            key: obj.storeName,
            nodeLabel: obj.storeName,
            idx: idx,
            lvlIdx: 1,
            value: {
              dbStoreInfo: obj
            }
          }));

          setDbStores(dbStores);
        } catch (err) {
          setError(getErrMsg(err));
        }
      }
    }, errMsg => {
      setIsLoading(false);
      setError(errMsg);
    }, warnMsg => {
      setWarning(warnMsg);
    });
  }

  React.useEffect(() => {
    if (props.data.isExpanded) {
      if (!dbStores && !error) {
        loadDbStores();
      }
    }
  }, [ 
    props.data,
    props.data.isExpanded,
    props.data.isCurrent,
    props.data.nodeLabel,
    props.expandedToggled,
    props.nodeClicked,
    isLoading,
    dbStores,
    error,
    warning] );

  return (<TrmrkTreeNode className={["trmrk-indexeddb-tree-node", isLoading ? "trmrk-is-loading" : "" ].join(" ")}
    iconNodeEl={<MatUIIcon className="trmrk-icon trmrk-icon-database" iconName="database" />}
    data={props.data}
    expandedChildren={ () => <TrmrkTreeNodesList
      className="trmrk-indexeddbStore-tree-nodes-list"
      dataArr={dbStores ?? []}
      isLoading={isLoading}
      hasError={!!error}
      error={error}
      nodeFactory={data => <TrmrkTreeNodeLeaf className="trmrk-indexeddbStore-tree-node"
        iconNodeEl={<MatUIIcon className="trmrk-icon trmrk-icon-table" iconName="table" />}
        data={data} nodeClicked={dbStoreNodeClicked} />}
      loadingNodeFactory={() => <LoadingDotPulse parentElTagName={"li"} />}
      errorNodeFactory={error => <div className='trmrk-error'>{ trmrk.errToString(error) ?? "Something went wrong" }</div>}
      emptyNodeFactory={() => <div className="trmrk-tree-node-empty">No data stores</div>} /> }
    expandedToggled={props.expandedToggled}
    nodeClicked={props.nodeClicked}>
      <Menu className="trmrk-menu"
        open={isDbStoreMenuOpen}
        anchorEl={currentDbStoreLabelRef.current}
        onClose={onDbStoreMenuClose}>
        <MenuList className='trmrk-menu-list'>
          <MenuItem>
            <IconButton> { props.data.isExpanded ? <ArrowDropDownIcon /> : <ArrowRightIcon /> } </IconButton>
            <IconButton><EditIcon /></IconButton>
            <IconButton><MoreVertIcon /></IconButton>
          </MenuItem>
        </MenuList>
      </Menu>
    </TrmrkTreeNode>);
}
