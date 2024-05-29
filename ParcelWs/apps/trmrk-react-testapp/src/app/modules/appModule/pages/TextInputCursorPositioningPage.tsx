import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Checkbox from '@mui/material/Checkbox';

import { extractTextInput } from "../../../../trmrk-browser/domUtils/textInput";
import { getTouchOrMouseCoords, toSingleTouchOrClick } from "../../../../trmrk-browser/domUtils/touchAndMouseEvents";
import TrmrkAppBarsPanel, { currentInputElMtblRef, updateCurrentInputEl } from "../../../../trmrk-react/components/barsPanel/TrmrkAppBarsPanel";
import { appBarSelectors, appBarReducers } from "../../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../../store/appDataSlice";

import { generateText } from "./generateText";

import { setTextCaretPositionerEnabledToLocalStorage,
  setTextCaretPositionerKeepOpenToLocalStorage } from "../../../../trmrk-browser/domUtils/core";

export interface TextInputCursorPositioningPageProps {
  urlPath: string
  basePath: string;
  rootPath: string;
}

export default function TextInputCursorPositioningPage(
  props: TextInputCursorPositioningPageProps) {

  const textBox1ElRef = React.createRef<HTMLElement>();
  const textArea1ElRef = React.createRef<HTMLElement>();
  const textBox2ElRef = React.createRef<HTMLElement>();
  const textArea2ElRef = React.createRef<HTMLElement>();

  const [ textBox1WrapperEl, setTextBox1WrapperEl ] = React.useState(textBox1ElRef.current);
  const [ textBox1El, setTextBox1El ] = React.useState<HTMLElement | null>(null);

  const [ textArea1WrapperEl, setTextArea1WrapperEl ] = React.useState(textArea1ElRef.current);
  const [ textArea1El, setTextArea1El ] = React.useState<HTMLElement | null>(null);

  const [ textBox2WrapperEl, setTextBox2WrapperEl ] = React.useState(textBox1ElRef.current);
  const [ textBox2El, setTextBox2El ] = React.useState<HTMLElement | null>(null);

  const [ textArea2WrapperEl, setTextArea2WrapperEl ] = React.useState(textArea2ElRef.current);
  const [ textArea2El, setTextArea2El ] = React.useState<HTMLElement | null>(null);

  const textCaretPositionerCurrentInputElLastSetOpIdx = useSelector(
    appDataSelectors.getTextCaretPositionerCurrentInputElLastSetOpIdx);

  const [ textBox1IsReadonly, setTextBox1IsReadonly ] = React.useState(true);
  const [ textArea1IsReadonly, setText1AreaIsReadonly ] = React.useState(true);

  const [ textBox2IsReadonly, setTextBox2IsReadonly ] = React.useState(true);
  const [ textArea2IsReadonly, setText2AreaIsReadonly ] = React.useState(true);

  const isDarkMode = useSelector(appDataSelectors.getIsDarkMode);

  const dispatch = useDispatch();

  const textObj = generateText();

  const [ singlelineText1, setSinglelineText1 ] = React.useState(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`);

  const [ multilineText1, setMultilineText1 ] = React.useState(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`);

  const [ singlelineText2, setSinglelineText2 ] = React.useState(textObj[0]);
  const [ multilineText2, setMultilineText2 ] = React.useState(textObj[1]);

  const onSingleLineText1Changed = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSinglelineText1(e.target.value);
    dispatch(appDataReducers.incTextCaretPositionerCurrentInputElLastSetOpIdx());
  }

  const onMultiLineText1Changed = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMultilineText1(e.target.value);
  }

  const onTextBox1IsReadonlyChanged = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setTextBox1IsReadonly(checked);
  }

  const onTextArea1IsReadonlyChanged = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setText1AreaIsReadonly(checked);
  }

  const onShowSinglelineText1CaretPositioner = (e: React.FocusEvent) => {
    updateCurrentInputEl(appDataReducers, dispatch, textBox1El);
  }

  const onHideSinglelineTextBox1CaretPositioner = (e: React.FocusEvent) => {
    updateCurrentInputEl(appDataReducers, dispatch, null);
  }

  const onShowMultilineText1CaretPositioner = (e: React.FocusEvent) => {
    updateCurrentInputEl(appDataReducers, dispatch, textArea1El);
  }

  const onHideMultilineTextBox1CaretPositioner = (e: React.FocusEvent) => {
    updateCurrentInputEl(appDataReducers, dispatch, null);
  }

  const onSingleLineText2Changed = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSinglelineText2(e.target.value);
  }

  const onMultiLineText2Changed = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMultilineText2(e.target.value);
  }

  const onTextBox2IsReadonlyChanged = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setTextBox2IsReadonly(checked);
  }

  const onTextArea2IsReadonlyChanged = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setText2AreaIsReadonly(checked);
  }

  const onShowSinglelineText2CaretPositioner = (e: React.FocusEvent) => {
    updateCurrentInputEl(appDataReducers, dispatch, textBox2El);
  }

  const onHideSinglelineTextBox2CaretPositioner = (e: React.FocusEvent) => {
    updateCurrentInputEl(appDataReducers, dispatch, null);
  }

  const onShowMultilineText2CaretPositioner = (e: React.FocusEvent) => {
    updateCurrentInputEl(appDataReducers, dispatch, textArea2El);
  }

  const onHideMultilineTextBox2CaretPositioner = (e: React.FocusEvent) => {
    updateCurrentInputEl(appDataReducers, dispatch, null);
  }

  React.useEffect(() => {
    if (textBox1ElRef.current !== textBox1WrapperEl) {
      setTextBox1WrapperEl(textBox1ElRef.current);
      setTextBox1El(extractTextInput(textBox1ElRef.current!));
    }
    
    if (textArea1ElRef.current !== textArea1WrapperEl) {
      setTextArea1WrapperEl(textArea1ElRef.current);
      setTextArea1El(extractTextInput(textArea1ElRef.current!));
    }
    
    if (textBox2ElRef.current !== textBox2WrapperEl) {
      setTextBox2WrapperEl(textBox2ElRef.current);
      setTextBox2El(extractTextInput(textBox2ElRef.current!));
    }
    
    if (textArea2ElRef.current !== textArea2WrapperEl) {
      setTextArea2WrapperEl(textArea2ElRef.current);
      setTextArea2El(extractTextInput(textArea2ElRef.current!));
    }
  }, [
    textBox1ElRef,
    textBox1El,
    textArea1ElRef,
    textArea1El,
    textBox2ElRef,
    textBox2El,
    textArea2ElRef,
    textArea2El,
    currentInputElMtblRef.value,
    textCaretPositionerCurrentInputElLastSetOpIdx,
    textBox2IsReadonly,
    textArea2IsReadonly,
    isDarkMode,
    singlelineText2,
    multilineText2 ]);
    
    return (<TrmrkAppBarsPanel basePath={props.basePath}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}>
    <div className="trmrk-block trmrk-horiz-padded trmrk-height-fit-content">
      <label>Readonly <Checkbox onChange={onTextBox1IsReadonlyChanged} checked={textBox1IsReadonly} /></label>
      <Input ref={textBox1ElRef} onChange={onSingleLineText1Changed} value={singlelineText1} readOnly={textBox1IsReadonly}
        onFocus={onShowSinglelineText1CaretPositioner}
        onBlur={onHideSinglelineTextBox1CaretPositioner} />
    </div>
    <div className="trmrk-block trmrk-horiz-padded trmrk-height-fit-content">
      <label>Readonly <Checkbox onChange={onTextArea1IsReadonlyChanged} checked={textArea1IsReadonly} /></label>
      <Input ref={textArea1ElRef} onChange={onMultiLineText1Changed} value={multilineText1} multiline rows={40} readOnly={textArea1IsReadonly}
        onFocus={onShowMultilineText1CaretPositioner}
        onBlur={onHideMultilineTextBox1CaretPositioner} />
    </div>
    <div className="trmrk-block trmrk-horiz-padded trmrk-height-fit-content">
      <label>Readonly <Checkbox onChange={onTextBox2IsReadonlyChanged} checked={textBox2IsReadonly} /></label>
      <Input ref={textBox2ElRef} onChange={onSingleLineText2Changed} value={singlelineText2} readOnly={textBox2IsReadonly}
        onFocus={onShowSinglelineText2CaretPositioner}
        onBlur={onHideSinglelineTextBox2CaretPositioner} />
    </div>
    <div className="trmrk-block trmrk-horiz-padded trmrk-height-fit-content">
      <Box className="trmrk-full-width trmrk-full-height"></Box>
    </div>
    <div className="trmrk-block trmrk-horiz-padded">
      <label>Readonly <Checkbox onChange={onTextArea2IsReadonlyChanged} checked={textArea2IsReadonly} /></label>
      <Input ref={textArea2ElRef} onChange={onMultiLineText2Changed} value={multilineText2} multiline rows={40} readOnly={textArea2IsReadonly}
        onFocus={onShowMultilineText2CaretPositioner}
        onBlur={onHideMultilineTextBox2CaretPositioner} />
    </div>
  </TrmrkAppBarsPanel>);
}
