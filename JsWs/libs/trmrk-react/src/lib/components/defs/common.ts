import { NullOrUndef } from "@/src/trmrk/core";

export interface ComponentProps {
  cssClass?: string | NullOrUndef;
  children?: React.ReactNode | NullOrUndef;
}

export interface KeyedComponent<TKey> {
  key: TKey;
  component: () => React.ReactNode;
}

export interface IntKeyedComponent extends KeyedComponent<number> {}
export interface StrKeyedComponent extends KeyedComponent<string> {}

export interface ComponentsMap {
  map: { [key: string]: () => React.ReactNode };
}

export interface IntKeyedComponentMap {
  map: { [key: number]: IntKeyedComponent };
}

export interface StrKeyedComponentMap {
  map: { [key: string]: IntKeyedComponent };
}
