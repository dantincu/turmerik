import { JSX } from "./typeDefs";

export interface BasicComponentProps {
  children?: JSX.Element | JSX.Element[];
}

export interface BasicHTMLAttributes {
  class?: string;
}
