import React from "react";

import {
  LongPressService,
  LongPressServiceInitArgs,
  createLongPressService
} from "@/src/trmrk-browser/domUtils/LongPressService";

import { actWithValIf } from "@/src/trmrk/core";

import { HOCArgs } from "../defs/HOC";

import { performInitialization } from "../../services/utils";

export interface TrmrkLongPressableProps<
  T extends React.ElementType,
  TRootHtmlElement extends HTMLElement = HTMLElement,
> {
  hoc: HOCArgs<T, TRootHtmlElement>,
  args: (rootEl: TRootHtmlElement) => LongPressServiceInitArgs
}

export default function TrmrkLongPressable<
  T extends React.ElementType,
  TRootHtmlElement extends HTMLElement = HTMLElement,
>({ hoc, args }: Readonly<TrmrkLongPressableProps<T, TRootHtmlElement>>) {
  const initializedRef = React.useRef(false);
  let longPressService: LongPressService | null = null;

  const rootElRef = hoc.rootElRef ?? React.useRef<TRootHtmlElement | null>(null);

  const rootElAvailable = (rootEl: TRootHtmlElement | null) => {
    performInitialization(initializedRef, () => longPressService = createLongPressService())
    actWithValIf(rootEl, rootEl => longPressService!.init(args(rootEl)));
    actWithValIf(hoc.rootElAvailable, f => f(rootEl));
  }

  const rootElUnavailable = (rootEl: TRootHtmlElement | null) => {
    initializedRef.current = false;
    longPressService?.dispose();
    longPressService = null;
    actWithValIf(hoc.rootElUnavailable, f => f(rootEl));
  }
  
  const Component = hoc.component!({ rootElRef, rootElAvailable, rootElUnavailable }) as React.ElementType;
  return (<Component></Component>);
}
