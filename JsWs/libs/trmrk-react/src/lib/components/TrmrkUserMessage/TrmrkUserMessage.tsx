import React, { CSSProperties } from "react";
import { Icon } from "@iconify/react";

import { UserMessageLevel, NullOrUndef } from '@/src/trmrk/core';
import { Placement } from "@/src/trmrk-browser/core";

import { CommponentProps } from "../defs/common";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";

import "./TrmrkUserMessage.scss";

export interface TrmrkUserMessageProps extends CommponentProps {
  msgLevel: UserMessageLevel;
  message: string;
  arrowPlacement: Placement;
  arrowStyle?: CSSProperties | NullOrUndef;
}

export default function TrmrkUserMessage(
  { cssClass, msgLevel, message, arrowPlacement = Placement.None, arrowStyle }: Readonly<TrmrkUserMessageProps>
) {
  const [messageFadeOut, setMessageFadeOut] = React.useState(false);

  const cssClassName = React.useMemo(() => {
    let cssClass: string;

    switch (msgLevel) {
      case UserMessageLevel.Success:
        cssClass = 'trmrk-success';
        break;
      case UserMessageLevel.Info:
        cssClass = 'trmrk-info';
        break;
      case UserMessageLevel.Warn:
        cssClass = 'trmrk-warn';
        break;
      case UserMessageLevel.Error:
        cssClass = 'trmrk-error';
        break;
      default:
        throw new Error(`Invalid user message level: ${msgLevel}`);
    }

    return cssClass;
  }, [msgLevel]);

  const arrowCssClass = React.useMemo(() => {
    let cssClass: string;

    switch (arrowPlacement) {
      case Placement.None:
        cssClass = '';
        break;
      case Placement.Top:
        cssClass = 'trmrk-placement-top';
        break;
      case Placement.Right:
        cssClass = 'trmrk-placement-right';
        break;
      case Placement.Bottom:
        cssClass = 'trmrk-placement-bottom';
        break;
      case Placement.Left:
        cssClass = 'trmrk-placement-left';
        break;
      default:
        cssClass = '';
        break;
    }

    return cssClass;
  }, [arrowPlacement]);

  return <div className={["trmrk-user-message-container", cssClass ?? ''].join(" ")}>
    <div className={['trmrk-user-message', cssClassName, messageFadeOut ? 'trmrk-fade' : ''].join(' ')}>
      <TrmrkBtn cssClass="trmrk-close-icon-btn"><Icon icon="mdi:close" /></TrmrkBtn>
      <div className="trmrk-content">
        <div className="trmrk-content-text trmrk-wrap-content">
          <span className="trmrk-text-part">{ message }</span>
        </div>
      </div>
      { arrowCssClass && <svg className="trmrk-arrow arrowCssClass" viewBox="0 0 20 10" style={ arrowStyle ?? undefined }>
        <path className="trmrk-arrow-body" strokeWidth="1" d="M 0 10 L 10 0 L 20 10" />
        <path className="trmrk-arrow-border" strokeWidth="1" d="M 0 10 L 10 0 L 20 10" fill="none" />
      </svg> }
    </div>
  </div>;
}
