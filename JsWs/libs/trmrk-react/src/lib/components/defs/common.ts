import { NullOrUndef } from "@/src/trmrk/core";

export type HtmlElementProps<THTMLElement extends HTMLElement = HTMLElement> =
  React.PropsWithoutRef<React.AnchorHTMLAttributes<THTMLElement>> &
    React.RefAttributes<THTMLElement>;

export interface ComponentProps {
  className?: string | undefined;
  children?: React.ReactNode | NullOrUndef;
}

export interface KeyedReactNode<TKey, TNode = React.ReactNode, TData = any> {
  key: TKey;
  typeName?: string | NullOrUndef;
  node: TNode;
  data?: TData;
}

export interface IntKeyedReactNode<
  TNode = React.ReactNode,
  TData = any,
> extends KeyedReactNode<number, TNode, TData> {}

export interface StrKeyedReactNode<
  TNode = React.ReactNode,
  TData = any,
> extends KeyedReactNode<string, TNode, TData> {}

export interface ComponentsMap {
  map: { [key: string]: () => React.ReactNode };
}

export interface IntKeyedReactNodesMap<TNode = React.ReactNode, TData = any> {
  map: { [key: number]: IntKeyedReactNode<TNode, TData> };
}

export interface StrKeyedReactNodesMap<TNode = React.ReactNode, TData = any> {
  map: { [key: string]: StrKeyedReactNode<TNode, TData> };
}
