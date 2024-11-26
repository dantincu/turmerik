import { ParentComponent } from "solid-js";

import { withInteractiveInterceptedParent, WithInteractiveInterceptedParentProps } from "./withInteractiveInterceptedParent";

export enum RippleBackColor {
  White = 0,
  Gray,
  Dark
}

export const getDefaultActiveClass = (
  ripleBackColor?: RippleBackColor | null | undefined
) => {
  let activeClass: string;

  switch (ripleBackColor) {
    case RippleBackColor.Gray:
      activeClass = "trmrk-ripple-gray-bg";
      break;
    case RippleBackColor.Dark:
      activeClass = "trmrk-ripple-dark-bg";
      break;
    default:
      activeClass = "trmrk-ripple";
      break;
  }

  return activeClass;
}

export interface WithRippleProps extends WithInteractiveInterceptedParentProps {
  rippleBackColor?: RippleBackColor | null | undefined
}

export function withRipple<T extends ParentComponent<P>, P extends Record<string, any> = {}>(
  InputComponent: T,
  hcoProps: WithRippleProps
): ParentComponent<P> {
  return (props) => {
    const fwProps = {...hcoProps};
    delete fwProps.rippleBackColor;
    fwProps.activeClass = fwProps.activeClass ?? getDefaultActiveClass(hcoProps.rippleBackColor);

    const EnhancedComponent = withInteractiveInterceptedParent<T, P>(InputComponent, fwProps);

    return (
      <EnhancedComponent {...props}>
        {props.children}
      </EnhancedComponent>
    );
  };
};
