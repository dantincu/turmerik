import React from "react";

import {
  PointerDragService,
  PointerDragServiceInitArgs,
  createPointerDragService
} from "@/src/trmrk-browser/domUtils/PointerDragService";

import { actWithValIf } from "@/src/trmrk/core";

import { HOCArgs } from "../defs/HOC";

import { updateRef } from "../../services/utils";

export interface TrmrkPointerDraggableProps<T, P> {
  hoc: HOCArgs<T, P>,
  args: PointerDragServiceInitArgs
}

export default function TrmrkPointerDraggable<T, P>({ hoc, args }: Readonly<TrmrkPointerDraggableProps<T, P>>) {
  const elRef = React.useRef<T | null>(null);
  let pointerDragService: PointerDragService | null = null;

  const Component = React.forwardRef<T, P>((props, ref) => hoc.node(props, (el) => {
    elRef.current = el;
    actWithValIf(ref, r => updateRef(r, el));

    if (!pointerDragService) {
      pointerDragService = createPointerDragService();
      pointerDragService.init(args);
    }
    
    pointerDragService.setHostElem(el as HTMLElement | null);
    
  }));

  React.useEffect(() => {
    pointerDragService = createPointerDragService();
    pointerDragService.init(args);
    pointerDragService.setHostElem(elRef.current as HTMLElement | null);

    return () => {
      pointerDragService?.dispose();
      pointerDragService = null;
    }
  }, []);
  
  return (<Component {...hoc.props}></Component>);
}
