import { createEffect, ParentComponent } from "solid-js";

import { MtblRefValue } from "../../../../trmrk/core";

import { withOverlay, WithOverlayProps } from "../withOverlay/withOverlay";

export interface WithInteractiveOverlayProps extends WithOverlayProps {
  activeClass?: string | null | undefined;
  activeIntervalMillis?: number | null | undefined;
}

export function withInteractiveOverlay<T extends ParentComponent<P>, P extends Record<string, any> = {}>(
  InputComponent: T,
  hcoProps: WithInteractiveOverlayProps
): ParentComponent {
  return (props) => {
    const overlayElemRef: MtblRefValue<HTMLElement | null> = {
      value: null
    };

    const timeoutIdRef: MtblRefValue<NodeJS.Timeout | null> = {
      value: null
    };

    const assignRef = (el: HTMLElement) => {
      overlayElemRef.value = el;

      if (hcoProps.overlayElRef) {
        hcoProps.overlayElRef(el);
      }
    }

    const activeClass = hcoProps.activeClass ?? "trmrk-active";
    const activeIntervalMillis = hcoProps.activeIntervalMillis ?? 400;

    const onMouseDownOrTouchStart = (evt: MouseEvent | TouchEvent) => {
      const callback = (add: boolean) => {
        const elem = overlayElemRef.value;
        console.log("callback", add);

        if (add) {  
          elem?.classList.add(activeClass);
        } else {
          elem?.classList.remove(activeClass);
        }
      };

      if (!timeoutIdRef.value) {
        callback(true);

        timeoutIdRef.value = setTimeout(() => {
          timeoutIdRef.value = null;
          callback(false);
        }, activeIntervalMillis);
      }
    }

    createEffect(() => {
      const elem = overlayElemRef.value;

      if (elem) {
        elem.addEventListener("mousedown", onMouseDownOrTouchStart, {
          capture: true
        });

        elem.addEventListener("touchstart", onMouseDownOrTouchStart, {
          capture: true
        });
      }

      return () => {
        const elem = overlayElemRef.value;
      
        if (elem) {
          elem.removeEventListener("mousedown", onMouseDownOrTouchStart, {
            capture: true
          });

          elem.removeEventListener("touchstart", onMouseDownOrTouchStart, {
            capture: true
          });
        }
      }
    }, [overlayElemRef.value]);

    const EnhancedComponent = withOverlay<T, P>(InputComponent, {
      overlayClass: hcoProps.overlayClass,
      overlayElRef: assignRef
    });

    return (
      <EnhancedComponent {...props}>
        {props.children}
      </EnhancedComponent>
    );
  };
}
