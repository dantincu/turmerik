import React from "react";

import { TrmrkTreeNodeData } from "./TrmrkTreeNodeData";

export interface TrmrkTreeNodesListProps<TTreeNodeData extends TrmrkTreeNodeData> {
  className?: string | null | undefined;
  dataArr: TTreeNodeData[];
  isLoading?: boolean | null | undefined;
  hasError?: boolean | null | undefined;
  error?: Error | any | undefined;
  nodeFactory: (data: TTreeNodeData) => React.ReactNode | Iterable<React.ReactNode>;
  loadingNodeFactory: () => React.ReactNode | Iterable<React.ReactNode>;
  errorNodeFactory: (error: Error | any | undefined) => React.ReactNode | Iterable<React.ReactNode>;
  emptyNodeFactory?: (() => React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
}

export default function TrmrkTreeNodesList<TTreeNodeState extends TrmrkTreeNodeData>(
  props: TrmrkTreeNodesListProps<TTreeNodeState>
) {
  React.useEffect(() => {
  }, [
    props.className,
    props.dataArr,
    props.isLoading,
    props.hasError,
    props.error ]);

  return <ul className={["trmrk-tree-nodes-list", props.className ?? ""].join(" ")}>
    { props.hasError ?
        props.errorNodeFactory(props.error) :
        props.isLoading ?
          props.loadingNodeFactory() :
          props.dataArr.length ?
            props.dataArr.map((node) => props.nodeFactory(node)) :
            props.emptyNodeFactory ?
              props.emptyNodeFactory() :
              null }
  </ul>
}
