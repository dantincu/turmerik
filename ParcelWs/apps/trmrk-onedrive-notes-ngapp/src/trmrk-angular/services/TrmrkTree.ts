import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkObservable } from './TrmrkObservable';

export interface TrmrkTreeNodeData<T> {
  nodeValue: T;
  // path: number[];
  isHcyNode?: boolean | null | undefined;
  isExpanded?: boolean | null | undefined;
  isSelectable?: boolean | null | undefined;
  isSelected?: boolean | null | undefined;
  isFocused?: boolean | null | undefined;
  isCurrent?: boolean | null | undefined;
  childNodes?: TrmrkTreeNodeData<T>[] | null | undefined;
}

export interface TrmrkTreeNode<T> {
  data: TrmrkObservable<TrmrkTreeNodeData<T>>;
  childNodesData?: TrmrkObservable<TrmrkTreeNodeData<T>[]> | null | undefined;
  childNodes?: TrmrkTreeNode<T>[] | null | undefined;
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

  nodeIconShortPressOrLeftClick: TrmrkObservable<
    TrmrkTreeNodeEventCore<T, TouchOrMouseCoords>
  >;

  nodeIconLongPressOrRightClick: TrmrkObservable<
    TrmrkTreeNodeEventCore<T, TouchOrMouseCoords>
  >;

  nodeColorLabelShortPressOrLeftClick: TrmrkObservable<
    TrmrkTreeNodeEventCore<T, TouchOrMouseCoords>
  >;

  nodeColorLabelLongPressOrRightClick: TrmrkObservable<
    TrmrkTreeNodeEventCore<T, TouchOrMouseCoords>
  >;

  nodeTextShortPressOrLeftClick: TrmrkObservable<
    TrmrkTreeNodeEventCore<T, TouchOrMouseCoords>
  >;

  nodeTextLongPressOrRightClick: TrmrkObservable<
    TrmrkTreeNodeEventCore<T, TouchOrMouseCoords>
  >;
}
