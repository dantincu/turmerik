import { Component } from "solid-js";

import { JSX } from "./typeDefs";

import { BasicHTMLAttributes } from "./extendedTypeDefs";

const Div: Component<JSX.HTMLAttributes<HTMLDivElement> & BasicHTMLAttributes> = (props: JSX.HTMLAttributes<HTMLDivElement> & BasicHTMLAttributes) => {
  return <div {...props}>{props.children}</div>
}

export default Div;
