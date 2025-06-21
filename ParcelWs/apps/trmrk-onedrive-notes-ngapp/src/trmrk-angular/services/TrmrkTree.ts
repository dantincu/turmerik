import { TrmrkObservable } from './TrmrkObservable';

export interface TrmrkTreeNodeData<T> {
  nodeValue: T;
  path: number[];
  isHcyNode?: boolean | null | undefined;
  isExpanded?: boolean | null | undefined;
  childNodes?: TrmrkTreeNodeData<T>[] | null | undefined;
}

export interface TrmrkTreeNode<T> {
  data: TrmrkObservable<TrmrkTreeNodeData<T>>;
  childNodesData?: TrmrkObservable<TrmrkTreeNodeData<T>[]> | null | undefined;
  childNodes?: TrmrkTreeNode<T>[] | null | undefined;
}

export interface TrmrkTreeNodeExpandedToggledEvent<T> {
  data: TrmrkTreeNodeData<T>;
  isExpandedNow: boolean;
}

export interface TrmrkTree<T> {
  rootNodesData: TrmrkObservable<TrmrkTreeNodeData<T>[]>;
  rootNodes: TrmrkTreeNode<T>[];
  nodeExpandedToggled: TrmrkObservable<TrmrkTreeNodeExpandedToggledEvent<T>>;
}
