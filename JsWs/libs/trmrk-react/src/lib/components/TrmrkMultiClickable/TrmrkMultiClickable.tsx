import React from "react";

import {
  MultiClickService,
  MultiClickServiceInitArgs,
  createMultiClickService
} from "@/src/trmrk-browser/domUtils/MultiClickService";

import { actWithValIf } from "@/src/trmrk/core";

import { HOCArgs } from "../defs/HOC";

import { performInitialization, updateRef } from "../../services/utils";

export interface TrmrkLongPressableProps<T, P> {
  hoc: HOCArgs<T, P>,
  args: (rootEl: T) => MultiClickServiceInitArgs
}

export default function TrmrkLongPressable<T, P>({ hoc, args }: Readonly<TrmrkLongPressableProps<T, P>>) {
  const initializedRef = React.useRef(false);
  let multiClickService: MultiClickService | null = null;

  const rootElAvailable = (el: T) => {
    performInitialization(initializedRef, () => multiClickService = createMultiClickService())
    actWithValIf(el, rootEl => multiClickService!.init(args(rootEl)));
    actWithValIf(hoc.props.ref, r => updateRef(r, el));
  }

  const Component = React.forwardRef(hoc.node);

  React.useEffect(() => {
    return () => {
      multiClickService?.dispose();
      multiClickService = null;
      initializedRef.current = false;
      actWithValIf(hoc.cleanup, f => f(hoc));
    }
  }, []);
  
  return (<Component {...hoc.props} ref={rootElAvailable}></Component>);
}
