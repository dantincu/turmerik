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
  expandedToggled: (data: TTreeNodeData) => void;
  nodeClicked: (data: TTreeNodeData, labelEl: HTMLDivElement, location: TrmrkTreeNodeClickLocation) => void;
}

export default function TrmrkTreeNode<TTreeNodeData extends TrmrkTreeNodeData>(
  props: TrmrkTreeNodeProps<TTreeNodeData>
) {
  const labelRef = React.createRef<HTMLDivElement>();

  const expandedToggled = () => {
    const isExpandedNewVal = !props.data.isExpanded;

    if (props.expandedToggled) {
      props.expandedToggled({
        ...props.data,
        isExpanded: isExpandedNewVal
      });
    }
  }

  const iconClicked = () => {
    props.nodeClicked({
      ...props.data,
      isCurrent: true
    },
    labelRef.current!,
    TrmrkTreeNodeClickLocation.Icon)
  }

  const labelClicked = () => {
    props.nodeClicked({
      ...props.data,
      isCurrent: true
    },
    labelRef.current!,
    TrmrkTreeNodeClickLocation.Label)
  }

  const expandNodeEl = props.expandNodeEl ?? <ArrowRightIcon className="trmrk-svg-icon"></ArrowRightIcon>;
  const collapseNodeEl = props.collapseNodeEl ?? <ArrowDropDownIcon className="trmrk-svg-icon"></ArrowDropDownIcon>;
  
  React.useEffect(() => {
  }, [
    props.className,
    props.data,
    props.data.isExpanded,
    props.data.isCurrent,
    props.data.nodeLabel,
    props.expandNodeEl,
    props.collapseNodeEl,
    props.expandedToggled ]);

  return <li className={["trmrk-tree-node", props.data.isCurrent ? "trmrk-current-item" : "", props.className ?? ""].join(" ")}>
    <Box className="trmrk-tree-node-toggle-icon" onClick={expandedToggled}>
      { props.data.isExpanded ? collapseNodeEl : expandNodeEl }
    </Box>
    <Box className="trmrk-tree-node-icon" onClick={iconClicked}>
      { props.iconNodeEl }
    </Box>
    <Box className="trmrk-tree-node-label" onClick={labelClicked} ref={labelRef}>
      { props.data.nodeLabel }
    </Box>
  </li>
}
