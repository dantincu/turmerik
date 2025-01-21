import { JSX } from "solid-js";

export interface ForwardRef<THTMLElement extends HTMLElement = HTMLElement> {
  ref?: (el: THTMLElement | null) => void;
}

export interface BasicHTMLAttributes {
  class?: string;
}
