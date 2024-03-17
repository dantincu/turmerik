export interface TrmrkTreeNodeData<TValue = any> {
  key: string | number | bigint;
  idx?: number | null | undefined;
  lvlIdx?: number | null | undefined;
  nodeLabel: string;
  value: TValue;
  isExpanded?: boolean | null | undefined;
  isCurrent?: boolean | null | undefined;
}
