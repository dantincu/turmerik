import { NullOrUndef } from "@/src/trmrk/core";
import React, { JSX } from "react";

export interface HigherOrderComponentArgsCore<
  TArgs extends HigherOrderComponentArgsCore<TArgs, T, TRootHtmlElement>,
  T extends React.ElementType,
  TRootHtmlElement extends HTMLElement = HTMLElement,
> {
  component: (
    args: TArgs,
  ) => (props: React.ComponentPropsWithRef<T>) => React.ReactElement;
  rootElRef: React.RefObject<TRootHtmlElement | null>;
}

export interface HigherOrderComponentArgs<
  T extends React.ElementType,
  TRootHtmlElement extends HTMLElement = HTMLElement,
> extends HigherOrderComponentArgsCore<
  HigherOrderComponentArgs<T, TRootHtmlElement>,
  T,
  TRootHtmlElement
> {}

export const normalizeHoc = <
  TArgs extends HigherOrderComponentArgsCore<TArgs, T, TRootHtmlElement>,
  T extends React.ElementType,
  TRootHtmlElement extends HTMLElement = HTMLElement,
>(
  hocVal: TArgs | NullOrUndef,
  component?:
    | ((
        args: TArgs,
      ) => (props: React.ComponentPropsWithRef<T>) => React.ReactElement)
    | NullOrUndef,
) => {
  hocVal ??= {} as TArgs;
  hocVal.rootElRef ??= React.useRef<TRootHtmlElement | null>(null);

  if (component) {
    hocVal.component ??= component;
  }

  return hocVal;
};
