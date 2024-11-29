import { JSX } from "solid-js";

export interface BasicComponentProps {
  children?: JSX.Element | JSX.Element[];
}

export interface BasicHTMLAttributes {
  class?: string;
}
