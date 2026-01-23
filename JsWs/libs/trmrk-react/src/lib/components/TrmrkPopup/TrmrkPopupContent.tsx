import { ComponentProps } from "../defs/common";

export interface TrmrkPopupContentProps extends ComponentProps {}

export default function TrmrkPopupContent({
  cssClass, children
}: TrmrkPopupContentProps) {
  return <div className={["trmrk-content", cssClass ?? ''].join(" ")}>
      <div className="trmrk-content-text trmrk-wrap-content">
        <span className="trmrk-text-part">{ children }</span>
      </div>
    </div>
}
