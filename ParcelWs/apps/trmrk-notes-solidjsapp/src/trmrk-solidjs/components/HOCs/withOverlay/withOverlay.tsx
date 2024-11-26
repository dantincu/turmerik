import { ParentComponent } from "solid-js";

export interface WithOverlayProps {
  overlayClass?: string | null | undefined;
  overlayElRef?: ((el: HTMLElement) => void) | null | undefined
}

export function withOverlay<T extends ParentComponent<P>, P extends Record<string, any> = {}>(
  InputComponent: T,
  hcoProps: WithOverlayProps
): ParentComponent {
  return (props) => {
    const assignRef = (el: HTMLElement) => {
      if (hcoProps.overlayElRef) {
        hcoProps.overlayElRef(el);
      }
    }

    return <InputComponent {...(props as P)}>
      <div class={hcoProps.overlayClass ?? "trmrk-overlay"} ref={assignRef}>
        {props.children}
      </div>
    </InputComponent>
  };
}
