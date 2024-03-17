import React from "react";

import { TrmrkTreeNodeState } from "./TreeNodeState";

export interface TrmrkTreeNodesListProps<TTreeNodeState extends TrmrkTreeNodeState> {
  className?: string | null | undefined;
  dataArr: TTreeNodeState[];
  isLoading?: boolean | null | undefined;
  nodeFactory: (state: TTreeNodeState) => React.ReactNode | Iterable<React.ReactNode>;
  loadingNodeFactory: () => React.ReactNode | Iterable<React.ReactNode>;
}

export default function TrmrkTreeNodesList<TTreeNodeState extends TrmrkTreeNodeState>(
  props: TrmrkTreeNodesListProps<TTreeNodeState>
) {
  React.useEffect(() => {
  }, [ props.className, props.dataArr, props.isLoading ]);

  return <ul className={["trmrk-tree-nodes-list", props.className ?? ""].join(" ")}>
    { props.isLoading ? props.loadingNodeFactory() : props.dataArr.map((node) => props.nodeFactory(node)) }
  </ul>
}
