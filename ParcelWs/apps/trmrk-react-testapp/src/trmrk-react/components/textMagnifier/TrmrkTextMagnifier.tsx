import React from "react";

import Paper from "@mui/material/Paper";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import WrapTextIcon from "@mui/icons-material/WrapText";

import MatUIIcon from "../icons/MatUIIcon";

import { getHcyElemBounds } from "../../../trmrk-browser/domUtils/getDomElemBounds";
import { positionTextCaret, TextCaretPositionerOpts, getTextCaretPositionerOpts } from "../../../trmrk-browser/textCaretPositioner/textCaretPositioner";
import { CaretCharJustify } from "../../../trmrk-browser/textCaretPositioner/textCaretPositionerCore";

export const DEFAULT_MAX_SPAN_LENGTH = 10;
export const DEFAULT_TAB_LENGTH_PX = 40;  

export interface TrmrkTextMagnifierProps {
  className?: string | number | undefined;
  maxSpanLength?: number | null | undefined;
  tabLengthPx?: number | null | undefined;
  textIsReadonly?: boolean | null | undefined;
  textIsMultiline?: boolean | null | undefined;
  isPositioningMode?: boolean | null | undefined;
  wrapText?: boolean | null | undefined;
  text: string;
  onCancelChangesClick: () => void;
  onSubmitChangesClick?: ((text: string) => void) | null | undefined;
}

export default React.forwardRef(function TrmrkTextMagnifier(
  props: TrmrkTextMagnifierProps,
  ref: ((instance: HTMLDivElement | null) => void) | React.RefObject<HTMLDivElement> | null | undefined
) {
  const [ isPositioningMode, setIsPositioningMode ] = React.useState(
    (props.isPositioningMode ?? false) || props.textIsReadonly
  );

  const [ inputEl, setInputEl ] = React.useState<HTMLDivElement | null>(null);
  const [ textCaretEl, setTextCaretEl ] = React.useState<HTMLSpanElement | null>(null);
  const [ invisibleTextCaretEl, setInvisibleTextCaretEl ] = React.useState<HTMLSpanElement | null>(null);
  const [ positioningTextEl, setPositioningTextEl ] = React.useState<HTMLPreElement | null>(null);
  const [ text, setText ] = React.useState<string>(props.text);
  const [ wrapText, setWrapText ] = React.useState(props.wrapText ?? true);

  const wrapTextRef = React.useRef(wrapText);

  const onCancelChangesClick = () => {
    props.onCancelChangesClick();
  }

  const onSubmitChangesClick = () => {
    if (props.onSubmitChangesClick) {
      props.onSubmitChangesClick(text);
    }
  }

  const onEnterEditModeClick = () => {
    setIsPositioningMode(false);
  }

  const onEnterPositioningModeClick = () => {
    setIsPositioningMode(true);
  }

  const onUnwrapTextClick = () => {
    setWrapText(false);
  }

  const onWrapTextClick = () => {
    setWrapText(true);
  }

  const positioningTextElemClicked = React.useCallback((ev: MouseEvent) => {
    const trgEl = ev.target;

    if (trgEl !== invisibleTextCaretEl && trgEl !== textCaretEl && trgEl instanceof HTMLElement) {
      /* const trgElemHcyBounds = getHcyElemBounds(positioningTextEl!, trgEl);
      const trgElemBounds = trgElemHcyBounds.slice(-1)[0];

      positionTextCaret({
        rootElem: positioningTextEl,
        trgElem: trgEl,
        invisibleCaretElem: invisibleTextCaretEl,
        visibleCaretElem: textCaretEl,
        trgElemHcyBounds,
        trgElemBounds,
        trgElemOffsetX: ev.offsetX + trgElemBounds.totalOffsetLeft + trgElemBounds.scrollLeft,
        trgElemOffsetY: ev.offsetY + trgElemBounds.totalOffsetTop + trgElemBounds.scrollTop,
        caretCharJustify: CaretCharJustify.Closest
      } as unknown as TextCaretPositionerOpts); */

      const opts = getTextCaretPositionerOpts(positioningTextEl!, trgEl, textCaretEl!, invisibleTextCaretEl!, ev);
      positionTextCaret(opts);
    }
  }, [ positioningTextEl, invisibleTextCaretEl, textCaretEl ]);

  React.useEffect(() => {
    if (wrapTextRef.current != wrapText) {
      wrapTextRef.current = wrapText;
    }

    const positioningTextElClick = (ev: MouseEvent) => {
      positioningTextElemClicked(ev);
    }

    if (positioningTextEl) {
      positioningTextEl.addEventListener("click", positioningTextElClick, {
        capture: true
      });
    }

    return () => {
      if (positioningTextEl) {
        positioningTextEl.removeEventListener("click", positioningTextElClick, {
          capture: true
        });
      }
    };
  }, [
    props.textIsReadonly,
    props.textIsMultiline,
    props.isPositioningMode,
    props.text,
    props.wrapText,
    wrapText,
    wrapTextRef,
    text,
    isPositioningMode,
    inputEl,
    positioningTextEl ]);

  return (<Paper className={[
      "trmrk-text-caret-positioner",
      props.textIsReadonly ? "trmrk-text-is-readonly" : "",
      props.textIsMultiline ? "trmrk-text-is-multiline" : "",
      props.className].join(" ")}
      ref={ref}>
    <IconButton className="trmrk-cancel-changes-btn" onClick={onCancelChangesClick}>
      <CancelIcon />
    </IconButton>
    { props.textIsReadonly ? null : <IconButton className="trmrk-submit-changes-btn"
        onClick={onSubmitChangesClick}>
      <DoneIcon /></IconButton> }
    { !props.textIsReadonly ? isPositioningMode ? <IconButton className="trmrk-enter-edit-mode-btn"
        onClick={onEnterEditModeClick}>
      <EditIcon /></IconButton> : <IconButton className="trmrk-enter-positioning-mode-btn"
        onClick={onEnterPositioningModeClick}>
      <MatUIIcon iconName="highlight_text_cursor" /></IconButton> : null }
    { isPositioningMode ? wrapText ? <IconButton className="trmrk-unwrap-text-btn" onClick={onUnwrapTextClick}>
      <WrapTextIcon />
    </IconButton> : <IconButton className="trmrk-wrap-text-btn" onClick={onWrapTextClick}>
      <WrapTextIcon />
    </IconButton> : null }
    
    { isPositioningMode ? <React.Fragment>
      <pre className={["trmrk-pre trmrk-scrollable trmrk-scrollableY", wrapText ? "trmrk-wrap-content" : "trmrk-scrollableX"].join(" ")}
        ref={el => setPositioningTextEl(el)}>
          <span className="trmrk-invisible-text-caret" ref={el => setInvisibleTextCaretEl(el)}></span>
          <span className="trmrk-text-caret" ref={el => setTextCaretEl(el)}></span>{text}</pre>
    </React.Fragment> : <React.Fragment>
      <div className={props.textIsMultiline ? "trmrk-textarea-container" : "trmrk-textbox-container"}>
        <Input multiline={props.textIsMultiline ?? undefined} fullWidth ref={ref => {
          if (props.textIsMultiline) {
            setInputEl(ref as HTMLDivElement);
          } else {
            setInputEl(null);
          }
        }} className={props.textIsMultiline ? "trmrk-textarea" : "trmrk-textbox"}
        value={text} onChange={ev => setText(ev.target.value)} />
      </div>
    </React.Fragment> }
  </Paper>);
});