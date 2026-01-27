import React from "react";

import {
  LongPressService,
  LongPressServiceInitArgs,
  createLongPressService
} from "@/src/trmrk-browser/domUtils/LongPressService";

import { actWithValIf } from "@/src/trmrk/core";

import { HOCArgs } from "../defs/HOC";

import { updateRef } from "../../services/utils";

export interface TrmrkLongPressableProps<T, P> {
  hoc: HOCArgs<T, P>,
  args: (rootEl: T) => LongPressServiceInitArgs
}

export default function TrmrkLongPressable<
  T, P,
>({ hoc, args }: Readonly<TrmrkLongPressableProps<T, P>>) {
  const initializedRef = React.useRef(false);
  let longPressService: LongPressService | null = null;

  const Component = React.forwardRef<T, P>((props, ref) => hoc.node(props, (el) => {
    longPressService?.dispose();
    longPressService = createLongPressService();
    actWithValIf(el, rootEl => longPressService!.init(args(rootEl)));
    actWithValIf(ref, r => updateRef(r, el));
  }));

  React.useEffect(() => {
    return () => {
      longPressService?.dispose();
      longPressService = null;
      initializedRef.current = false;
    }
  }, []);
  
  return (<Component {...hoc.props}></Component>);
}
