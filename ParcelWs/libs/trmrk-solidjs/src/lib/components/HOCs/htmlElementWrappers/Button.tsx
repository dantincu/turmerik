import { Component } from "solid-js";

import { JSX } from "./typeDefs";

const Button: Component = (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
  // @ts-ignore
  return <button {...props}></button>
}

export default Button;
