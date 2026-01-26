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

  const rootElAvailable = (el: T) => {
    performInitialization(initializedRef, () => pointerDragService = createPointerDragService())
    actWithValIf(el, rootEl => pointerDragService!.init(args(rootEl)));
    actWithValIf(hoc.props.ref, r => updateRef(r, el));
  }

  const Component = React.forwardRef(hoc.node);

  React.useEffect(() => {
    return () => {
      pointerDragService?.dispose();
      pointerDragService = null;
      initializedRef.current = false;
      actWithValIf(hoc.cleanup, f => f(hoc));
    }
  }, []);
  
  return (<Component {...hoc.props} ref={rootElAvailable}></Component>);
}
