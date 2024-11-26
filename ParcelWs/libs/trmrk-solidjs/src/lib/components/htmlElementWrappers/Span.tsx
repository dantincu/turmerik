import { Component } from "solid-js";

import { JSX } from "./typeDefs";
import { BasicHTMLAttributes } from "./extendedTypeDefs";

const Span: Component<JSX.HTMLAttributes<HTMLSpanElement> & BasicHTMLAttributes> = (props: JSX.HTMLAttributes<HTMLSpanElement> & BasicHTMLAttributes) => {
  return <span {...props}>{props.children}</span>
}

export default Span;
