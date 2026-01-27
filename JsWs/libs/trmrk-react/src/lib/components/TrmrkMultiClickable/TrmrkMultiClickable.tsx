import React from "react";

import {
  MultiClickService,
  MultiClickServiceInitArgs,
  createMultiClickService
} from "@/src/trmrk-browser/domUtils/MultiClickService";

import { actWithValIf } from "@/src/trmrk/core";

import { HOCArgs } from "../defs/HOC";

import { updateRef } from "../../services/utils";

export interface TrmrkLongPressableProps<T, P> {
  hoc: HOCArgs<T, P>,
  args: (rootEl: T) => MultiClickServiceInitArgs
}

export default function TrmrkLongPressable<T, P>({ hoc, args }: Readonly<TrmrkLongPressableProps<T, P>>) {
  const initializedRef = React.useRef(false);
  let multiClickService: MultiClickService | null = null;

  const Component = React.forwardRef<T, P>((props, ref) => hoc.node(props, (el) => {
    multiClickService?.dispose();
    multiClickService = createMultiClickService();
    actWithValIf(el, rootEl => multiClickService!.init(args(rootEl)));
    actWithValIf(ref, r => updateRef(r, el));
  }));

  React.useEffect(() => {
    return () => {
      multiClickService?.dispose();
      multiClickService = null;
      initializedRef.current = false;
    }
  }, []);
  
  return (<Component {...hoc.props}></Component>);
}
