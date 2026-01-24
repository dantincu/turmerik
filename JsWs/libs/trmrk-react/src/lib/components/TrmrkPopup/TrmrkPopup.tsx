import React, { CSSProperties, JSX } from "react";
import { Icon } from "@iconify/react";

import { UserMessageLevel, NullOrUndef, actWithValIf } from '@/src/trmrk/core';
import { Placement, defaultSlowAnimationDurationMillis } from "@/src/trmrk-browser/core";

import { ComponentProps } from "../defs/common";
import { clearRefVal } from "../../services/utils";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";
import TrmrkLongPressable from "../TrmrkLongPressable/TrmrkLongPressable";

import "./TrmrkPopup.scss";

export interface TrmrkPopupProps extends ComponentProps {
  msgLevel?: UserMessageLevel | NullOrUndef;
  show?: number | NullOrUndef;
  arrowPlacement?: Placement | NullOrUndef;
  arrowStyle?: CSSProperties | NullOrUndef;
  closed?: ((userClosed: boolean) => void) | NullOrUndef;
  autoCloseMillis?: number | NullOrUndef;
}

const CloseIcon = React.memo(({
    closeBtnLongPressOrRightClick,
    closeBtnClick
  }: {
    closeBtnLongPressOrRightClick: () => void,
    closeBtnClick: () => void
  }) => <TrmrkLongPressable hoc={{
    component: (hoc) => (props) => <TrmrkBtn {...({...props, cssClass: [props.cssClass, 'trmrk-close-icon-btn'].join(' ')})} hoc={hoc}>
      <TrmrkIcon icon="mdi:close" /></TrmrkBtn>
  }} args={hostElem => ({
      hostElem,
      longPressOrRightClick: (e) => closeBtnLongPressOrRightClick(),
      shortPressOrLeftClick: (e) => closeBtnClick()
    })}></TrmrkLongPressable>);

export default function TrmrkPopup(
  { cssClass, children, msgLevel, show, arrowPlacement = Placement.None, arrowStyle, closed, autoCloseMillis }: Readonly<TrmrkPopupProps>
) {
  const rootElRef = React.useRef<HTMLDivElement | null>(null);
  const autoCloseMillisVal = React.useMemo(() => autoCloseMillis ?? 5000, [autoCloseMillis]);
  const showValRef = React.useRef(0);
  const timeoutId = React.useRef<NodeJS.Timeout | null>(null);

  const [messageFadeOut, setMessageFadeOut] = React.useState(false);
  const [showEl, setShowEl] = React.useState(false);
  const [autoCloseEl, setAutoCloseEl] = React.useState(autoCloseMillisVal > 0);

  const cssClassName = React.useMemo(() => {
    let cssClass = '';

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
    }

    return cssClass;
  }, [msgLevel]);

  const arrowCssClass = React.useMemo(() => {
    let cssClass = '';

    switch (arrowPlacement) {
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
    }

    return cssClass;
  }, [arrowPlacement]);

  const closeBtnClick = React.useCallback(() => {
    setMessageFadeOut(false);
    setShowEl(false);
    clearFadeTimeout();
    actWithValIf(closed, f => f(true));
  }, []);

  const closeBtnLongPressOrRightClick = React.useCallback(() => {
    setAutoCloseEl(!autoCloseEl);
  }, [autoCloseEl]);

  const setFadeTimeout = React.useCallback(() => {
    timeoutId.current = setTimeout(() => {
      setMessageFadeOut(true);
      
      timeoutId.current = setTimeout(() => {
        setMessageFadeOut(false);
        setShowEl(false);
        actWithValIf(closed, f => f(false));
      }, defaultSlowAnimationDurationMillis);
    }, autoCloseMillisVal);
  }, []);

  const clearFadeTimeout = React.useCallback(() => {
    clearRefVal(timeoutId, clearTimeout);
  }, []);

  

  React.useEffect(() => {
    if (show !== showValRef.current) {
      showValRef.current = show ?? 0;
      const shouldShowEl = showValRef.current > 0;
      setShowEl(shouldShowEl);
      clearFadeTimeout();

      if (shouldShowEl) {
        if (autoCloseEl) {
          setFadeTimeout();
        }
      }
    }
  }, [show, autoCloseEl])

  React.useEffect(() => {
    return () => {
      clearFadeTimeout();
    }
  }, []);

  return showEl && <div className={["trmrk-popup-container", cssClass ?? ''].join(" ")} ref={rootElRef}>
    <div className={['trmrk-popup', cssClassName, messageFadeOut ? 'trmrk-fade' : ''].join(' ')}>
      <CloseIcon closeBtnLongPressOrRightClick={closeBtnLongPressOrRightClick} closeBtnClick={closeBtnClick} />
      { children }
      <div className="trmrk-basement">{ arrowCssClass && <svg className={["trmrk-arrow", arrowCssClass].join(" ")} viewBox="0 0 20 10" style={ arrowStyle ?? undefined }>
        <path className="trmrk-arrow-body" strokeWidth="1" d="M 0 10 L 10 0 L 20 10" />
        <path className="trmrk-arrow-border" strokeWidth="1" d="M 0 10 L 10 0 L 20 10" fill="none" />
      </svg> }</div>
    </div>
  </div>;
}
