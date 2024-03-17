import React from "react";

import Box from "@mui/material/Box";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { TrmrkTreeNodeData } from "./TrmrkTreeNodeData";

export type TrmrkTreeNodeType<TTreeNodeData extends TrmrkTreeNodeData> = typeof TrmrkTreeNode<TTreeNodeData>;

export enum TrmrkTreeNodeClickLocation {
  Icon,
  Label
}

export interface TrmrkTreeNodeProps<TTreeNodeData extends TrmrkTreeNodeData> {
  className?: string | null | undefined;
  data: TTreeNodeData;
  expandNodeEl?: React.ReactNode | null | undefined;
  collapseNodeEl?: React.ReactNode | null | undefined;
  iconNodeEl: React.ReactNode;
  expandedToggled?: ((state: TTreeNodeData) => void) | null | undefined;
  nodeClicked: (state: TTreeNodeData, labelEl: HTMLDivElement, location: TrmrkTreeNodeClickLocation) => boolean | null | undefined | void;
}

export default function TrmrkTreeNode<TTreeNodeData extends TrmrkTreeNodeData>(
  props: TrmrkTreeNodeProps<TTreeNodeData>
) {
  const [ isExpanded, setIsExpanded ] = React.useState(props.data.isExpanded ?? false);
  const [ isCurrent, setIsCurrent ] = React.useState(props.data.isCurrent ?? false);

  const labelRef = React.createRef<HTMLDivElement>();

  const expandedToggled = () => {
    const isExpandedNewVal = !isExpanded;
    setIsExpanded(isExpandedNewVal);

    if (props.expandedToggled) {
      props.expandedToggled({
        ...props.data,
        isExpanded: isExpandedNewVal
      });
    }
  }

  const iconClicked = () => {
    if (!props.nodeClicked({
      ...props.data,
      isCurrent: true
    },
    labelRef.current!,
    TrmrkTreeNodeClickLocation.Icon)) {
      setIsCurrent(true);
    }
  }

  const labelClicked = () => {
    if (!props.nodeClicked({
      ...props.data,
      isCurrent: true
    },
    labelRef.current!,
    TrmrkTreeNodeClickLocation.Label)) {
      setIsCurrent(true);
    }
  }

  const expandNodeEl = props.expandNodeEl ?? <ArrowRightIcon className="trmrk-svg-icon"></ArrowRightIcon>;
  const collapseNodeEl = props.collapseNodeEl ?? <ArrowDropDownIcon className="trmrk-svg-icon"></ArrowDropDownIcon>;
  
  React.useEffect(() => {
    if (!!props.data.isExpanded !== isExpanded) {
      setIsExpanded(props.data.isExpanded ?? false);
    }

    if (!!props.data.isCurrent !== isCurrent) {
      setIsCurrent(props.data.isCurrent ?? false);
    }
  }, [
    props.className,
    props.data,
    props.data.isExpanded,
    props.data.isCurrent,
    props.data.nodeLabel,
    props.expandNodeEl,
    props.collapseNodeEl,
    props.expandedToggled,
    isExpanded,
    isCurrent ]);

  return <li className={["trmrk-tree-node", isCurrent ? "trmrk-current-item" : "", props.className ?? ""].join(" ")}>
    <Box className="trmrk-tree-node-toggle-icon" onClick={expandedToggled}>
      { isExpanded ? collapseNodeEl : expandNodeEl }
    </Box>
    <Box className="trmrk-tree-node-icon" onClick={iconClicked}>
      { props.iconNodeEl }
    </Box>
    <Box className="trmrk-tree-node-label" onClick={labelClicked} ref={labelRef}>
      { props.data.nodeLabel }
    </Box>
  </li>
}
