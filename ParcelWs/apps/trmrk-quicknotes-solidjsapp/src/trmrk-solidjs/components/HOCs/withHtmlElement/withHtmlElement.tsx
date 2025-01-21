import { ParentComponent, JSX } from "solid-js";

export type SupportedTagName = "button" | "div" | "span";

export interface WithHtmlElementProps<THTMLElement extends HTMLElement> {
  tagName: SupportedTagName
  ref?: ((el: THTMLElement) => void) | null | undefined;
}

export function withHtmlElement<THTMLElement extends HTMLElement, P extends JSX.HTMLAttributes<THTMLElement>>(
  hcoProps: WithHtmlElementProps<THTMLElement>
): ParentComponent<P> {
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
      case "button":
        InterceptorComponent = pps => <button {...pps} ref={assignRef}>{pps.children}</button>
        break;
      case "div":
        InterceptorComponent = pps => <div {...pps} ref={assignRef}>{pps.children}</div>
        break;
      case "span":
        InterceptorComponent = pps => <span {...pps}>{pps.children}</span>
        break;
      default:
        throw new Error(`Tag name not supported by withHtmlElement higher order component: ${hcoProps.tagName}`);
    }

    return (<InterceptorComponent {...props}>{dynProps.children}</InterceptorComponent>);
  };
}
