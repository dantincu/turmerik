import React, { CSSProperties} from "react";

import { UserMessageLevel, NullOrUndef, actWithValIf } from '@/src/trmrk/core';
import { Placement, defaultSlowAnimationDurationMillis } from "@/src/trmrk-browser/core";

import { ComponentProps } from "../defs/common";
import { clearRefVal } from "../../services/utils";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";

import "./TrmrkMessagePopover.scss";

export interface TrmrkMessagePopoverProps extends ComponentProps {
  msgLevel?: UserMessageLevel | NullOrUndef;
  show?: number | NullOrUndef;
  arrowPlacement?: Placement | NullOrUndef;
  arrowStyle?: CSSProperties | NullOrUndef;
  closed?: ((userClosed: boolean) => void) | NullOrUndef;
  autoCloseMillis?: number | NullOrUndef;
}

const CloseIcon = React.memo(({
    closeBtnLongPressOrRightClick,
    closeBtnClick,
    ref,
  }: {
    closeBtnLongPressOrRightClick: (event: React.MouseEvent) => void,
    closeBtnClick: () => void
    ref: React.Ref<HTMLButtonElement>
  }) => <TrmrkBtn ref={ref} className='trmrk-close-icon-btn' onClick={closeBtnClick} onContextMenu={closeBtnLongPressOrRightClick}><TrmrkIcon icon="mdi:close" /></TrmrkBtn>);

export default function TrmrkMessagePopover(
  { className, children, msgLevel, show, arrowPlacement = Placement.None, arrowStyle, closed, autoCloseMillis }: Readonly<TrmrkMessagePopoverProps>
) {
  const rootElRef = React.useRef<HTMLDivElement | null>(null);
  const closeBtnElRef = React.useRef<HTMLButtonElement | null>(null);
  const autoCloseMillisVal = React.useMemo(() => autoCloseMillis ?? 5000, [autoCloseMillis]);
  const showValRef = React.useRef(0);
  const timeoutId = React.useRef<NodeJS.Timeout | null>(null);

  const [messageFadeOut, setMessageFadeOut] = React.useState(false);
  const [showEl, setShowEl] = React.useState(false);
  const [autoCloseEl, setAutoCloseEl] = React.useState(autoCloseMillisVal > 0);

  const cssClassName = React.useMemo(() => {
    let cssClass = '';

    switch (msgLevel) {
      case UserMessageLevel.Default:
        cssClass = 'trmrk-default';
        break;
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
    clearAutoCloseTimeout();
    actWithValIf(closed, f => f(true));
  }, []);

  const closeBtnLongPressOrRightClick = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setAutoCloseEl(!autoCloseEl);
    clearAutoCloseTimeout();
    setMessageFadeOut(false);
  }, [autoCloseEl]);

  const setAutoCloseTimeout = React.useCallback(() => {
    timeoutId.current = setTimeout(() => {
      setMessageFadeOut(true);
      
      timeoutId.current = setTimeout(() => {
        setMessageFadeOut(false);
        setShowEl(false);
        actWithValIf(closed, f => f(false));
      }, defaultSlowAnimationDurationMillis);
    }, autoCloseMillisVal);
  }, [autoCloseEl]);

  const clearAutoCloseTimeout = React.useCallback(() => {
    clearRefVal(timeoutId, clearTimeout);
  }, []);

  const containerPointerDown = React.useCallback((event: React.PointerEvent) => {
    const closeBtnEl = closeBtnElRef.current;

    if (closeBtnEl) {
      const target = event.target as HTMLElement;

      if (!closeBtnEl.contains(target)){
        setAutoCloseEl(false);
        clearAutoCloseTimeout();
        setMessageFadeOut(false);
      }
    }
  }, [autoCloseEl]);

  React.useEffect(() => {
    if (show !== showValRef.current) {
      showValRef.current = show ?? 0;
      const shouldShowEl = showValRef.current > 0;
      setShowEl(shouldShowEl);
      clearAutoCloseTimeout();

      if (shouldShowEl) {
        if (autoCloseEl) {
          setAutoCloseTimeout();
        }
      }
    }
  }, [show, autoCloseEl])

  React.useEffect(() => {
    return () => {
      clearAutoCloseTimeout();
      showValRef.current = 0;
    }
  }, []);

  return showEl && <div className={["trmrk-message-popover-container", className ?? '', cssClassName, messageFadeOut ? 'trmrk-fade' : ''].join(" ")}
      ref={rootElRef} onPointerDownCapture={containerPointerDown}>
    <div className="trmrk-basement">{ arrowCssClass && <svg className={["trmrk-arrow", arrowCssClass].join(" ")} viewBox="0 0 20 10" style={ arrowStyle ?? undefined }>
      <path className="trmrk-arrow-body" strokeWidth="1" d="M 0 10 L 10 0 L 20 10" />
      <path className="trmrk-arrow-border" strokeWidth="1" d="M 0 10 L 10 0 L 20 10" fill="none" />
    </svg> }</div>
    <div className={['trmrk-message-popover'].join(' ')}>
      <CloseIcon closeBtnLongPressOrRightClick={closeBtnLongPressOrRightClick} closeBtnClick={closeBtnClick} ref={closeBtnElRef} />
      { children }
    </div>
  </div>;
}
