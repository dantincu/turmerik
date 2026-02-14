import { NullOrUndef } from "@/src/trmrk/core";

export type HtmlElementProps<THTMLElement extends HTMLElement = HTMLElement> =
  React.PropsWithoutRef<React.AnchorHTMLAttributes<THTMLElement>> &
    React.RefAttributes<THTMLElement>;

export interface ComponentProps {
  className?: string | undefined;
  children?: React.ReactNode | NullOrUndef;
}

export interface KeyedNode<TKey, TNode = React.ReactNode, TData = any> {
  key: TKey;
  typeName?: string | NullOrUndef;
  node: TNode;
  nodeData?: TData;
}

export interface IntKeyedNode<
  TNode = React.ReactNode,
  TData = any,
> extends KeyedNode<number, TNode, TData> {}

export interface StrKeyedNode<
  TNode = React.ReactNode,
  TData = any,
> extends KeyedNode<string, TNode, TData> {}

export interface ComponentsMap {
  map: { [key: string]: () => React.ReactNode };
}

export interface IntKeyedNodesMap<TNode = React.ReactNode, TData = any> {
  map: { [key: number]: IntKeyedNode<TNode, TData> };
}

export interface StrKeyedNodesMap<TNode = React.ReactNode, TData = any> {
  map: { [key: string]: StrKeyedNode<TNode, TData> };
}
