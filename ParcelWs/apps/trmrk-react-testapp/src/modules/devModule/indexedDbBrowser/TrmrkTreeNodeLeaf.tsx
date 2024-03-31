import React from "react";

import Box from "@mui/material/Box";

import { TrmrkTreeNodeLeafData, TrmrkTreeNodeClickLocation } from "./TrmrkTreeNodeData";

export type TrmrkTreeNodeLeafType<TTreeNodeData extends TrmrkTreeNodeLeafData> = typeof TrmrkTreeNodeLeaf<TTreeNodeData>;

export interface TrmrkTreeNodeLeafProps<TTreeNodeData extends TrmrkTreeNodeLeafData> {
  className?: string | null | undefined;
  data: TTreeNodeData;
  iconNodeEl: React.ReactNode;
  children?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  nodeClicked: (data: TTreeNodeData, labelEl: HTMLDivElement, location: TrmrkTreeNodeClickLocation) => void;
}

export default function TrmrkTreeNodeLeaf<TTreeNodeData extends TrmrkTreeNodeLeafData>(
  props: TrmrkTreeNodeLeafProps<TTreeNodeData>
) {
  const labelRef = React.createRef<HTMLDivElement>();

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

  React.useEffect(() => {
  }, [
    props.className,
    props.data,
    props.data.isCurrent,
    props.data.nodeLabel, ]);

  return <li className={["trmrk-tree-node-leaf",
      props.data.isCurrent ? "trmrk-current-item" : "",
      props.className ?? ""].join(" ")}>
    <Box className="trmrk-tree-node-content">
      <Box className="trmrk-tree-node-icon" onClick={iconClicked}>
        { props.iconNodeEl }
      </Box>
      <Box className="trmrk-tree-node-label" onClick={labelClicked} ref={labelRef}>
        { props.data.nodeLabel }
      </Box>
    </Box>
    { props.children }
  </li>
}
