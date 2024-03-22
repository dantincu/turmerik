export interface TrmrkTreeNodeLeafData<TValue = any> {
  key: string | number | bigint;
  idx?: number | null | undefined;
  lvlIdx?: number | null | undefined;
  nodeLabel: string;
  value: TValue;
  isCurrent?: boolean | null | undefined;
}

export interface TrmrkTreeNodeData<TValue = any>
  extends TrmrkTreeNodeLeafData<TValue> {
  isExpanded?: boolean | null | undefined;
}

export enum TrmrkTreeNodeClickLocation {
  Icon,
  Label,
}
