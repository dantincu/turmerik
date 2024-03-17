import React from "react";

import { TrmrkTreeNodeData } from "./TrmrkTreeNodeData";

export interface TrmrkTreeNodesListProps<TTreeNodeData extends TrmrkTreeNodeData> {
  className?: string | null | undefined;
  dataArr: TTreeNodeData[];
  isLoading?: boolean | null | undefined;
  nodeFactory: (data: TTreeNodeData) => React.ReactNode | Iterable<React.ReactNode>;
  loadingNodeFactory: () => React.ReactNode | Iterable<React.ReactNode>;
}

export default function TrmrkTreeNodesList<TTreeNodeState extends TrmrkTreeNodeData>(
  props: TrmrkTreeNodesListProps<TTreeNodeState>
) {
  React.useEffect(() => {
  }, [ props.className, props.dataArr, props.isLoading ]);

  return <ul className={["trmrk-tree-nodes-list", props.className ?? ""].join(" ")}>
    { props.isLoading ? props.loadingNodeFactory() : props.dataArr.map((node) => props.nodeFactory(node)) }
  </ul>
}
