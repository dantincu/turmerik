import React from "react";

import {
  PointerDragService,
  PointerDragServiceInitArgs,
  createPointerDragService
} from "@/src/trmrk-browser/domUtils/PointerDragService";

import { actWithValIf } from "@/src/trmrk/core";

import { HOCArgs } from "../defs/HOC";

import { performInitialization } from "../../services/utils";

export interface TrmrkLongPressableProps<
  T extends React.ElementType,
  TRootHtmlElement extends HTMLElement = HTMLElement,
> {
  hoc: HOCArgs<T, TRootHtmlElement>,
  args: (rootEl: TRootHtmlElement) => PointerDragServiceInitArgs
}

export default function TrmrkLongPressable<
  T extends React.ElementType,
  TRootHtmlElement extends HTMLElement = HTMLElement,
>({ hoc, args }: Readonly<TrmrkLongPressableProps<T, TRootHtmlElement>>) {
  const initializedRef = React.useRef(false);
  let pointerDragService: PointerDragService | null = null;

  const rootElRef = hoc.rootElRef ?? React.useRef<TRootHtmlElement | null>(null);

  const rootElAvailable = (rootEl: TRootHtmlElement | null) => {
    performInitialization(initializedRef, () => pointerDragService = createPointerDragService())
    actWithValIf(rootEl, rootEl => pointerDragService!.init(args(rootEl)));
    actWithValIf(hoc.rootElAvailable, f => f(rootEl));
  }

  const rootElUnavailable = (rootEl: TRootHtmlElement | null) => {
    initializedRef.current = false;
    pointerDragService?.dispose();
    pointerDragService = null;
    actWithValIf(hoc.rootElUnavailable, f => f(rootEl));
  }

  const Component = hoc.node!({ rootElRef, rootElAvailable, rootElUnavailable }) as React.ElementType;
  return (<Component></Component>);
}
