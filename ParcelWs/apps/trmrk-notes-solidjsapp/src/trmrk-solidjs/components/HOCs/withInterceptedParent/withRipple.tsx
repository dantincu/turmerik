import { ParentComponent } from "solid-js";

import { withInteractiveInterceptedParent, WithInteractiveInterceptedParentProps } from "./withInteractiveInterceptedParent";

export interface WithRippleProps extends WithInteractiveInterceptedParentProps {
}

export function withRipple<T extends ParentComponent<P>, P extends Record<string, any> = {}>(
  InputComponent: T,
  hcoProps: WithInteractiveInterceptedParentProps
): ParentComponent<P> {
  return (props) => {
    const fwProps = {...hcoProps};
    fwProps.activeClass = fwProps.activeClass ?? "trmrk-ripple";

    const EnhancedComponent = withInteractiveInterceptedParent<T, P>(InputComponent, fwProps);

    return (
      <EnhancedComponent {...props}>
        {props.children}
      </EnhancedComponent>
    );
  };
};
