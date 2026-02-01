import React from "react";

import {
  MultiClickService,
  MultiClickServiceInitArgs,
  createMultiClickService
} from "@/src/trmrk-browser/domUtils/MultiClickService";

import { actWithValIf } from "@/src/trmrk/core";

import { HOCArgs } from "../defs/HOC";

import { updateRef } from "../../services/utils";

export interface TrmrkMultiClickableProps<T, P> {
  hoc: HOCArgs<T, P>,
  args: (rootEl: T) => MultiClickServiceInitArgs
}

export default function TrmrkMultiClickable<T, P>({ hoc, args }: Readonly<TrmrkMultiClickableProps<T, P>>) {
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
    }
  }, []);
  
  return (<Component {...hoc.props}></Component>);
}
