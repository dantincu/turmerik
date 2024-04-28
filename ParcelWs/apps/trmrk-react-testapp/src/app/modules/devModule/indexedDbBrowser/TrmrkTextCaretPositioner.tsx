import React from "react";

import Paper from "@mui/material/Paper";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";

import MatUIIcon from "../../synced-libs/trmrk-react/components/icons/MatUIIcon";

export const DEFAULT_MAX_SPAN_LENGTH = 10;
export const DEFAULT_TAB_LENGTH_PX = 40;  

export interface TrmrkTextCaretPositionerProps {
  className?: string | number | undefined;
  maxSpanLength?: number | null | undefined;
  tabLengthPx?: number | null | undefined;
  textIsReadonly?: boolean | null | undefined;
  textIsMultiline?: boolean | null | undefined;
  isPositioningMode?: boolean | null | undefined;
  text?: string | null | undefined;
  textLines?: string[] | null | undefined;
  onCancelChangesClick: () => void;
  onSubmitChangesClick?: (() => void) | null | undefined;
}

export default React.forwardRef(function TrmrkTextCaretPositioner(
  props: TrmrkTextCaretPositionerProps,
  ref: ((instance: HTMLDivElement | null) => void) | React.RefObject<HTMLDivElement> | null | undefined
) {
  const [ isPositioningMode, setIsPositioningMode ] = React.useState(
    (props.isPositioningMode ?? false) || props.textIsReadonly
  );

  const [ inputEl, setInputEl ] = React.useState<HTMLDivElement | null>(null);

  const onCancelChangesClick = () => {
    props.onCancelChangesClick();
  }

  const onSubmitChangesClick = () => {
    if (props.onSubmitChangesClick) {
      props.onSubmitChangesClick();
    }
  }

  const onEnterEditModeClick = () => {
    setIsPositioningMode(false);
  }

  const onEnterPositioningModeClick = () => {
    setIsPositioningMode(true);
  }

  React.useEffect(() => {
    console.log("inputEl", inputEl);
  }, [
    props.textIsReadonly,
    props.textIsMultiline,
    props.isPositioningMode,
    props.text,
    props.textLines,
    isPositioningMode,
    inputEl ]);

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
    { !props.textIsReadonly ? isPositioningMode ? <IconButton className="trmrk-enter-edit-mode"
        onClick={onEnterEditModeClick}>
      <EditIcon /></IconButton> : <IconButton className="trmrk-enter-positioning-mode"
        onClick={onEnterPositioningModeClick}>
      <MatUIIcon iconName="highlight_text_cursor" /></IconButton> : null }
    
    { isPositioningMode ? <React.Fragment>

    </React.Fragment> : <React.Fragment>
      <div className={props.textIsMultiline ? "trmrk-textarea-container" : "trmrk-textbox-container"}>
        <Input multiline={props.textIsMultiline ?? undefined} fullWidth ref={ref => {
          if (props.textIsMultiline) {
            setInputEl(ref as HTMLDivElement);
          } else {
            setInputEl(null);
          }
        }} className={props.textIsMultiline ? "trmrk-textarea" : "trmrk-textbox"} />
      </div>
    </React.Fragment> }
  </Paper>);
});
