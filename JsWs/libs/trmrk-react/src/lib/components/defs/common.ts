import { NullOrUndef } from "@/src/trmrk/core";

export interface ComponentProps {
  cssClass?: string | NullOrUndef;
  children?: React.ReactNode | NullOrUndef;
}

export interface KeyedReactNode<TKey> {
  key: TKey;
  node: () => React.ReactNode;
}

export interface IntKeyedReactNode extends KeyedReactNode<number> {}
export interface StrKeyedReactNode extends KeyedReactNode<string> {}

export interface ComponentsMap {
  map: { [key: string]: () => React.ReactNode };
}

export interface IntKeyedReactNodesMap {
  map: { [key: number]: IntKeyedReactNode };
}

export interface StrKeyedReactNodesMap {
  map: { [key: string]: IntKeyedReactNode };
}
