import { NullOrUndef } from "@/src/trmrk/core";
import React, { JSX } from "react";

export interface HOCArgsCore<
  TArgs extends HOCArgsCore<TArgs, T, TRootHtmlElement>,
  T extends React.ElementType,
  TRootHtmlElement extends HTMLElement = HTMLElement,
> {
  component: (
    args: TArgs,
  ) => (props: React.ComponentPropsWithRef<T>) => React.ReactElement;
  rootElRef: React.RefObject<TRootHtmlElement | null>;
}

export interface HOCArgs<
  T extends React.ElementType,
  TRootHtmlElement extends HTMLElement = HTMLElement,
> extends HOCArgsCore<HOCArgs<T, TRootHtmlElement>, T, TRootHtmlElement> {}

export const normalizeHoc = <
  TArgs extends HOCArgsCore<TArgs, T, TRootHtmlElement>,
  T extends React.ElementType,
  TRootHtmlElement extends HTMLElement = HTMLElement,
>(
  hocArgs: TArgs | NullOrUndef,
  component?:
    | ((
        args: TArgs,
      ) => (props: React.ComponentPropsWithRef<T>) => React.ReactElement)
    | NullOrUndef,
) => {
  hocArgs ??= {} as TArgs;
  hocArgs.rootElRef ??= React.useRef<TRootHtmlElement | null>(null);

  if (component) {
    hocArgs.component ??= component;
  }

  return hocArgs;
};
