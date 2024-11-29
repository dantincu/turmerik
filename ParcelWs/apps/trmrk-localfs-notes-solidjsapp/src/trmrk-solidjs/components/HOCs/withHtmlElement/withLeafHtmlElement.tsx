import { Component, JSX } from "solid-js";

export type SupportedLeafTagName = "input";

export interface WithLeafHtmlElementProps<THTMLElement extends HTMLElement> {
  tagName: SupportedLeafTagName
  ref?: ((el: THTMLElement) => void) | null | undefined;
}

export function withLeafHtmlElement<THTMLElement extends HTMLElement, P extends JSX.HTMLAttributes<THTMLElement>>(
  hcoProps: WithLeafHtmlElementProps<THTMLElement>
): Component<P> {
  return (props) => {
    const dynProps = props as any;

    const assignRef = (el: HTMLElement) => {
      if (dynProps.ref) {
        dynProps.ref(el as THTMLElement);
      }

      if (hcoProps.ref) {
        hcoProps.ref(el as THTMLElement);
      }
    }

    let InterceptorComponent: (props: any) => JSX.Element;

    switch (hcoProps.tagName) {
      case "input":
        InterceptorComponent = pps => <input {...pps} ref={assignRef} />
        break;
      default:
        throw new Error(`Tag name not supported by withLeafHtmlElement higher order component: ${hcoProps.tagName}`);
    }

    return (<InterceptorComponent {...props} />)
  };
}
