import React from "react";

import {
  LongPressService,
  LongPressServiceInitArgs,
  createLongPressService
} from "@/src/trmrk-browser/domUtils/LongPressService";

import { actWithValIf } from "@/src/trmrk/core";

import { HOCArgs } from "../defs/HOC";

import { performInitialization, updateRef } from "../../services/utils";

export interface TrmrkLongPressableProps<T, P> {
  hoc: HOCArgs<T, P>,
  args: (rootEl: T) => LongPressServiceInitArgs
}

export default function TrmrkLongPressable<
  T, P,
>({ hoc, args }: Readonly<TrmrkLongPressableProps<T, P>>) {
  const initializedRef = React.useRef(false);
  let longPressService: LongPressService | null = null;

  const rootElAvailable = (el: T) => {
    performInitialization(initializedRef, () => longPressService = createLongPressService())
    actWithValIf(el, rootEl => longPressService!.init(args(rootEl)));
    actWithValIf(hoc.props.ref, r => updateRef(r, el));
  }

  const Component = React.forwardRef(hoc.node);

  React.useEffect(() => {
    return () => {
      longPressService?.dispose();
      longPressService = null;
      initializedRef.current = false;
      actWithValIf(hoc.cleanup, f => f(hoc));
    }
  }, []);
  
  return (<Component {...hoc.props} ref={rootElAvailable}></Component>);
}
