import React from "react";

import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkAppModal.scss";

export interface TrmrkAppModalProps extends React.ComponentPropsWithRef<'div'> {
  show: boolean;
  opened?: (() => void) | NullOrUndef;
  closed?: (() => void) | NullOrUndef;
}

const TrmrkAppModal = React.memo(React.forwardRef<HTMLDivElement, TrmrkAppModalProps>(({ className, children, show, opened, closed, ...props }, ref) => {
  const showValRef = React.useRef(show);

  React.useEffect(() => {
  }, []);

  React.useEffect(() => {
    if (show && !showValRef.current) {
      opened?.();
    } else if (!show && showValRef.current) {
      closed?.();
    }

    showValRef.current = show;
  }, [show, opened, closed]);

  return <div ref={ref} className={[className ?? "", "trmrk-app-modal-container", show ? "trmrk-show" : "trmrk-hide"].join(' ')} {...props}>
    { children }
  </div>;
}));

export default TrmrkAppModal;
