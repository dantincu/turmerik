import React from "react";

import {
  MultiClickService,
  MultiClickServiceInitArgs,
  createMultiClickService
} from "@/src/trmrk-browser/domUtils/MultiClickService";

import { actWithValIf } from "@/src/trmrk/core";

import { HOCArgs } from "../defs/HOC";

import { performInitialization } from "../../services/utils";

export interface TrmrkLongPressableProps<
  T extends React.ElementType,
  TRootHtmlElement extends HTMLElement = HTMLElement,
> {
  hoc: HOCArgs<T, TRootHtmlElement>,
  args: (rootEl: TRootHtmlElement) => MultiClickServiceInitArgs
}

export default function TrmrkLongPressable<
  T extends React.ElementType,
  TRootHtmlElement extends HTMLElement = HTMLElement,
>({ hoc, args }: Readonly<TrmrkLongPressableProps<T, TRootHtmlElement>>) {
  const initializedRef = React.useRef(false);
  let multiClickService: MultiClickService | null = null;

  const rootElRef = hoc.rootElRef ?? React.useRef<TRootHtmlElement | null>(null);

  const rootElAvailable = (rootEl: TRootHtmlElement | null) => {
    performInitialization(initializedRef, () => multiClickService = createMultiClickService())
    actWithValIf(rootEl, rootEl => multiClickService!.init(args(rootEl)));
    actWithValIf(hoc.rootElAvailable, f => f(rootEl));
  }

  const rootElUnavailable = (rootEl: TRootHtmlElement | null) => {
    initializedRef.current = false;
    multiClickService?.dispose();
    multiClickService = null;
    actWithValIf(hoc.rootElUnavailable, f => f(rootEl));
  }

  const Component = hoc.node!({ rootElRef, rootElAvailable, rootElUnavailable }) as React.ElementType;
  return (<Component></Component>);
}
