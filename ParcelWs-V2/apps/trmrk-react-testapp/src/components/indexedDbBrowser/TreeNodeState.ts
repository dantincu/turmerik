export interface TrmrkTreeNodeState<TData = any> {
  key: string | number | bigint;
  idx?: number | null | undefined;
  lvlIdx?: number | null | undefined;
  nodeLabel: string;
  data: TData;
  isExpanded: boolean;
  isCurrent: boolean;
}
