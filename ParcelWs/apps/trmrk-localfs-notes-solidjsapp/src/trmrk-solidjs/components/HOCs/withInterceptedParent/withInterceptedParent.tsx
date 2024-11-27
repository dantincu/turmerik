import { ParentComponent } from "solid-js";

import { JSX } from "../withHtmlElement/typeDefs";

import { withHtmlElement, SupportedTagName } from "../withHtmlElement/withHtmlElement";

export interface WithInterceptedParentProps {
  interceptorClass?: string | null | undefined;
  interceptorTagName?: SupportedTagName | null | undefined;
  interceptorInsertedTagName?: SupportedTagName | null | undefined;
  interceptorInsertedElRef?: ((el: HTMLElement) => void) | null | undefined
}

export function withInterceptedParent<T extends ParentComponent<P>, P extends Record<string, any> = {}>(
  InputComponent: T,
  hcoProps: WithInterceptedParentProps
): ParentComponent<P> {
  return (props) => {
    const assignRef = (el: HTMLElement) => {
      if (hcoProps.interceptorInsertedElRef) {
        hcoProps.interceptorInsertedElRef(el);
      }
    }

    let InterceptorComponent = withHtmlElement({
      tagName: hcoProps.interceptorTagName ?? "div"
    });

    let InterceptorInsertedComponent = withHtmlElement({
      tagName: hcoProps.interceptorInsertedTagName ?? "div"
    });

    return <InputComponent {...(props as P)}>
      <InterceptorComponent class={hcoProps.interceptorClass ?? "trmrk-parent-interceptor"}>
        <InterceptorInsertedComponent class="trmrk-interceptor-inserted" ref={assignRef}></InterceptorInsertedComponent>
        {props.children}
      </InterceptorComponent>
    </InputComponent>
  };
}
