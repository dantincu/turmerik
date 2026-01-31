import { NullOrUndef } from "@/src/trmrk/core";

export type HtmlElementProps<THTMLElement extends HTMLElement = HTMLElement> =
  React.PropsWithoutRef<React.AnchorHTMLAttributes<THTMLElement>> &
    React.RefAttributes<THTMLElement>;

export interface ComponentProps {
  className?: string | undefined;
  children?: React.ReactNode | NullOrUndef;
}

export interface KeyedReactNode<TKey> {
  key: TKey;
  node: React.ReactNode;
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
