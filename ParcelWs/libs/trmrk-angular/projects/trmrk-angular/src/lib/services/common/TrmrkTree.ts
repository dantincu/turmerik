import { queryMx } from '../../../trmrk/arr';
import { TouchOrMouseCoords } from '../../../trmrk-browser/domUtils/touchAndMouseEvents';
import { NullOrUndef } from '../../../trmrk/core';

import { TrmrkObservable } from './TrmrkObservable';

export interface TrmrkTreeNodeData<T> {
  nodeValue: T;
  isHcyNode?: boolean | NullOrUndef;
  isExpanded?: boolean | NullOrUndef;
  isSelectable?: boolean | NullOrUndef;
  isSelected?: boolean | NullOrUndef;
  isFocused?: boolean | NullOrUndef;
  isCurrent?: boolean | NullOrUndef;
  childNodes?: TrmrkTreeNodeData<T>[] | NullOrUndef;
}

export interface TrmrkTreeNode<T> {
  data: TrmrkObservable<TrmrkTreeNodeData<T>>;
  childNodesData?: TrmrkObservable<TrmrkTreeNodeData<T>[]> | NullOrUndef;
  childNodes?: TrmrkTreeNode<T>[] | NullOrUndef;
}

export interface TrmrkTreeNodeEventCore<T, TEvent = any> {
  data: TrmrkTreeNodeData<T>;
  path: number[];
  event: TEvent;
}

export interface TrmrkTreeNodeEvent<T, TValue, TEvent = any>
  extends TrmrkTreeNodeEventCore<T, TEvent> {
  value: TValue;
}

export interface TrmrkTree<T> {
  rootNodesData: TrmrkObservable<TrmrkTreeNodeData<T>[]>;
  rootNodes: TrmrkTreeNode<T>[];
  nodeExpandedToggled: TrmrkObservable<TrmrkTreeNodeEvent<T, boolean>>;
  nodeCheckBoxToggled: TrmrkObservable<TrmrkTreeNodeEvent<T, boolean>>;

  nodeIconShortPressOrLeftClick: TrmrkObservable<TrmrkTreeNodeEventCore<T, TouchOrMouseCoords>>;

  nodeIconLongPressOrRightClick: TrmrkObservable<TrmrkTreeNodeEventCore<T, TouchOrMouseCoords>>;

  nodeColorLabelShortPressOrLeftClick: TrmrkObservable<
    TrmrkTreeNodeEventCore<T, TouchOrMouseCoords>
  >;

  nodeColorLabelLongPressOrRightClick: TrmrkObservable<
    TrmrkTreeNodeEventCore<T, TouchOrMouseCoords>
  >;

  nodeTextShortPressOrLeftClick: TrmrkObservable<TrmrkTreeNodeEventCore<T, TouchOrMouseCoords>>;

  nodeTextLongPressOrRightClick: TrmrkObservable<TrmrkTreeNodeEventCore<T, TouchOrMouseCoords>>;
}

export const trmrkTreeEventHandlers = {
  nodeExpandedToggled: <TTreeNode>(
    treeData: TrmrkTree<TTreeNode>,
    event: TrmrkTreeNodeEvent<TTreeNode, boolean, any>
  ) => {
    const lastIdx = event.path.at(-1)!;
    const prPath = event.path.slice(0, -1);

    let node: TrmrkTreeNode<TTreeNode>;

    if (prPath.length > 0) {
      const prNode = queryMx(treeData.rootNodes, 'childNodes', prPath)!;
      node = prNode.childNodes![lastIdx];
    } else {
      node = treeData.rootNodes[lastIdx];
    }

    node.data.next({ ...event.data, isExpanded: event.value });
  },

  nodeTextLongPressOrRightClick: <TTreeNode>(
    treeData: TrmrkTree<TTreeNode>,
    event: TrmrkTreeNodeEventCore<TTreeNode, TouchOrMouseCoords>
  ) => {
    const lastIdx = event.path.at(-1)!;
    const prPath = event.path.slice(0, -1);

    let childNodes: TrmrkTreeNode<TTreeNode>[];
    let childNodesObs: TrmrkObservable<TrmrkTreeNodeData<TTreeNode>[]>;

    if (prPath.length > 0) {
      const prNode = queryMx(treeData.rootNodes, 'childNodes', prPath)!;
      childNodes = prNode.childNodes!;
      childNodesObs = prNode.childNodesData!;
    } else {
      childNodes = treeData.rootNodes;
      childNodesObs = treeData.rootNodesData;
    }

    childNodes.splice(lastIdx, 1);
    const childNodesData = [...childNodesObs.value];
    childNodesData.splice(lastIdx, 1);
    childNodesObs.next(childNodesData);
  },
};
