import React from "react";

import Box from "@mui/material/Box";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { TrmrkTreeNodeState } from "./TreeNodeState";

export type TrmrkTreeNodeType<TTreeNodeState extends TrmrkTreeNodeState> = typeof TrmrkTreeNode<TTreeNodeState>;

export enum TrmrkTreeNodeClickLocation {
  Icon,
  Label
}

export interface TrmrkTreeNodeProps<TTreeNodeState extends TrmrkTreeNodeState> {
  className?: string | null | undefined;
  state: TTreeNodeState;
  expandNodeEl?: React.ReactNode | null | undefined;
  collapseNodeEl?: React.ReactNode | null | undefined;
  iconNodeEl: React.ReactNode;
  expandedToggled?: ((state: TTreeNodeState) => void) | null | undefined;
  nodeClicked: (state: TTreeNodeState, labelEl: HTMLDivElement, location: TrmrkTreeNodeClickLocation) => boolean | null | undefined | void;
}

export default function TrmrkTreeNode<TTreeNodeState extends TrmrkTreeNodeState>(
  props: TrmrkTreeNodeProps<TTreeNodeState>
) {
  const [ isExpanded, setIsExpanded ] = React.useState(props.state.isExpanded);
  const [ isCurrent, setisCurrent ] = React.useState(props.state.isCurrent);

  const labelRef = React.createRef<HTMLDivElement>();

  const expandedToggled = () => {
    const isExpandedNewVal = !isExpanded;
    setIsExpanded(isExpandedNewVal);

    if (props.expandedToggled) {
      props.expandedToggled({
        ...props.state,
        isExpanded: isExpandedNewVal
      });
    }
  }

  const iconClicked = () => {
    if (!props.nodeClicked({
      ...props.state,
      isCurrent: true
    },
    labelRef.current!,
    TrmrkTreeNodeClickLocation.Icon)) {
      setisCurrent(true);
    }
  }

  const labelClicked = () => {
    if (!props.nodeClicked({
      ...props.state,
      isCurrent: true
    },
    labelRef.current!,
    TrmrkTreeNodeClickLocation.Label)) {
      setisCurrent(true);
    }
  }

  const expandNodeEl = props.expandNodeEl ?? <ArrowRightIcon className="trmrk-svg-icon"></ArrowRightIcon>;
  const collapseNodeEl = props.collapseNodeEl ?? <ArrowDropDownIcon className="trmrk-svg-icon"></ArrowDropDownIcon>;
  
  React.useEffect(() => {
    if (props.state.isExpanded !== isExpanded) {
      setIsExpanded(props.state.isExpanded);
    }

    if (props.state.isCurrent !== isCurrent) {
      setisCurrent(props.state.isCurrent);
    }
  }, [
    props.className,
    props.state.isExpanded,
    props.state.isCurrent,
    props.state.nodeLabel,
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
      { props.state.nodeLabel }
    </Box>
  </li>
}
