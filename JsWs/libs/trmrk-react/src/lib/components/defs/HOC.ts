import { NullOrUndef } from "@/src/trmrk/core";

export interface HOCArgsCore<
  TArgs extends HOCArgsCore<TArgs, T, TRootHtmlElement>,
  T extends React.ElementType,
  TRootHtmlElement extends HTMLElement = HTMLElement,
> {
  node?:
    | ((
        args: TArgs,
      ) => (props: React.ComponentPropsWithRef<T>) => React.ReactNode)
    | NullOrUndef;
  rootElAvailable?: ((rootEl: TRootHtmlElement | null) => void) | NullOrUndef;
  rootElUnavailable?: ((rootEl: TRootHtmlElement | null) => void) | NullOrUndef;
}

export interface HOCArgs<
  T extends React.ElementType,
  TRootHtmlElement extends HTMLElement = HTMLElement,
> extends HOCArgsCore<HOCArgs<T, TRootHtmlElement>, T, TRootHtmlElement> {}
