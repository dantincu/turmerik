import { Component } from "solid-js";

import { JSX } from "./typeDefs";

import { BasicHTMLAttributes } from "./extendedTypeDefs";

const Button: Component<JSX.HTMLAttributes<HTMLButtonElement> & BasicHTMLAttributes> = (props: JSX.HTMLAttributes<HTMLButtonElement> & BasicHTMLAttributes) => {
  return <button {...props}>{props.children}</button>
}

export default Button;
