import { ParentComponent } from "solid-js";

import { withInteractiveOverlay, WithInteractiveOverlayProps } from "./withInteractiveOverlay";

export interface WithRippleProps extends WithInteractiveOverlayProps {
}

export function withRipple<T extends ParentComponent<P>, P extends Record<string, any> = {}>(
  InputComponent: T,
  hcoProps: WithInteractiveOverlayProps
): ParentComponent<P> {
  return (props) => {
    const fwProps = {...hcoProps};
    fwProps.activeClass = fwProps.activeClass ?? "trmrk-ripple";

    const EnhancedComponent = withInteractiveOverlay<T, P>(InputComponent, fwProps);

    return (
      <EnhancedComponent {...props}>
        {props.children}
      </EnhancedComponent>
    );
  };
};
