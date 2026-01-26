import React from "react";

import {
  PointerDragService,
  PointerDragServiceInitArgs,
  createPointerDragService
} from "@/src/trmrk-browser/domUtils/PointerDragService";

import { actWithValIf } from "@/src/trmrk/core";

import { HOCArgs } from "../defs/HOC";

import { performInitialization, updateRef } from "../../services/utils";

export interface TrmrkLongPressableProps<T, P> {
  hoc: HOCArgs<T, P>,
  args: (rootEl: T) => PointerDragServiceInitArgs
}

export default function TrmrkLongPressable<T, P>({ hoc, args }: Readonly<TrmrkLongPressableProps<T, P>>) {
  const initializedRef = React.useRef(false);
  let pointerDragService: PointerDragService | null = null;

  const Component = React.forwardRef<T, P>((props, ref) => hoc.node(props, (el) => {
    performInitialization(initializedRef, () => pointerDragService = createPointerDragService());
    actWithValIf(el, rootEl => pointerDragService!.init(args(rootEl)));
    actWithValIf(ref, r => updateRef(r, el));
  }));

  React.useEffect(() => {
    return () => {
      pointerDragService?.dispose();
      pointerDragService = null;
      initializedRef.current = false;
      actWithValIf(hoc.cleanup, f => f(hoc));
    }
  }, []);
  
  return (<Component {...hoc.props}></Component>);
}
