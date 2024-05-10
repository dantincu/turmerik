import React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import Checkbox from '@mui/material/Checkbox';

import AppBarsPanel from "../../../../trmrk-react/components/barsPanel/AppBarsPanel";
import { appBarSelectors, appBarReducers } from "../../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../../store/appDataSlice";

import MatUIIcon from "../../../../trmrk-react/components/icons/MatUIIcon";
import TrmrkTextCaretPositionerModal from "../../../../trmrk-react/components/textCaretPositioner/TrmrkTextCaretPositionerModal";

export interface CodeTextCursorPositioningProps {
  urlPath: string
  basePath: string;
  rootPath: string;
}

const generateText = (): string[] => {
  const txt1 = "This is a ridiculously long text."
  const txt2 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  const txt3 = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";

  const seedArr = [...Array(10).keys()];
  const singleTextLine = seedArr.map(i => txt3).join(" ");
  const multilineTextPart = [ txt1, txt2, txt3 ].join("\n")

  const firstMultilineTextPart = [
    multilineTextPart,
    singleTextLine].join("\n");

  const multilineTextLines = seedArr.map(
    i => multilineTextPart);

  multilineTextLines.splice(
    0, 0, firstMultilineTextPart);

  const multilineText = multilineTextLines.join("\n");
  return [singleTextLine, multilineText];
}

export default function CodeTextCursorPositioning(
  props: CodeTextCursorPositioningProps
) {const textBoxElRef = React.createRef<HTMLInputElement>();
  const textAreaElRef = React.createRef<HTMLTextAreaElement>();

  const [ textBoxEl, setTextBoxEl ] = React.useState(textBoxElRef.current);
  const [ textAreaEl, setTextAreaEl ] = React.useState(textAreaElRef.current);

  const [ textBoxIsReadonly, setTextBoxIsReadonly ] = React.useState(false);
  const [ textAreaIsReadonly, setTextAreaIsReadonly ] = React.useState(false);

  const [ showSinglelineTextCaretPositioner, setShowSinglelineTextCaretPositioner ] = React.useState(false);
  const [ showMultilineTextCaretPositioner, setShowMultilineTextCaretPositioner ] = React.useState(false);

  const isDarkMode = useSelector(appDataSelectors.getIsDarkMode);

  const textObj = generateText();

  const [ singlelineText, setSinglelineText ] = React.useState(textObj[0]);
  const [ multilineText, setMultilineText ] = React.useState(textObj[1]);

  const onSingleLineTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSinglelineText(e.target.value);
  }

  const onMultiLineTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMultilineText(e.target.value);
  }

  const onTextBoxIsReadonlyChanged = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setTextBoxIsReadonly(checked);
  }

  const onTextAreaIsReadonlyChanged = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setTextAreaIsReadonly(checked);
  }

  const onShowSinglelineTextCaretPositioner = () => {
    setShowSinglelineTextCaretPositioner(true);
  }

  const onHideSinglelineTextBoxCaretPositioner = () => {
    setShowSinglelineTextCaretPositioner(false);
  }

  const onShowMultilineTextCaretPositioner = () => {
    setShowMultilineTextCaretPositioner(true);
  }

  const onHideMultilineTextBoxCaretPositioner = () => {
    setShowMultilineTextCaretPositioner(false);
  }

  React.useEffect(() => {
    if (textBoxElRef.current !== textBoxEl) {
      setTextBoxEl(textBoxElRef.current);
    }

    if (textAreaElRef.current !== textAreaEl) {
      setTextAreaEl(textAreaElRef.current);
    }
  }, [
    textBoxElRef,
    textBoxEl,
    textAreaElRef,
    textAreaEl,
    textBoxIsReadonly,
    textAreaIsReadonly,
    showSinglelineTextCaretPositioner,
    showMultilineTextCaretPositioner,
    isDarkMode,
    singlelineText,
    multilineText ]);

  return (<AppBarsPanel basePath={props.basePath}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}>
    <div className="trmrk-block trmrk-horiz-padded">
      <label>Readonly <Checkbox onChange={onTextBoxIsReadonlyChanged} /></label>
      <Input ref={textBoxElRef} onChange={onSingleLineTextChanged} value={singlelineText} />
      <IconButton onClick={onShowSinglelineTextCaretPositioner}><MatUIIcon iconName="highlight_text_cursor" /></IconButton>
    </div>
    <div className="trmrk-block trmrk-horiz-padded">
      <Box className="trmrk-full-width trmrk-full-height"></Box>
    </div>
    <div className="trmrk-block trmrk-horiz-padded">
      <label>Readonly <Checkbox onChange={onTextAreaIsReadonlyChanged} /></label>
      <Input ref={textAreaElRef} onChange={onMultiLineTextChanged} value={multilineText} multiline rows={4} />
      <IconButton onClick={onShowMultilineTextCaretPositioner}><MatUIIcon iconName="highlight_text_cursor" /></IconButton>
    </div>

    { textBoxEl ? <TrmrkTextCaretPositionerModal
      isOpen={showSinglelineTextCaretPositioner}
      isDarkMode={isDarkMode}
      handleClose={onHideSinglelineTextBoxCaretPositioner}
      positioner={{
        text: singlelineText,
        textIsReadonly: textBoxIsReadonly,
        onCancelChangesClick: onHideSinglelineTextBoxCaretPositioner,
        onSubmitChangesClick: onHideSinglelineTextBoxCaretPositioner
      }} /> : null }

      { textAreaEl ? <TrmrkTextCaretPositionerModal
        isOpen={showMultilineTextCaretPositioner}
        isDarkMode={isDarkMode}
        handleClose={onHideMultilineTextBoxCaretPositioner}
        positioner={{
          text: multilineText,
          textIsReadonly: textAreaIsReadonly,
          textIsMultiline: true,
          onCancelChangesClick: onHideMultilineTextBoxCaretPositioner,
          onSubmitChangesClick: onHideMultilineTextBoxCaretPositioner
        }} /> : null }
  </AppBarsPanel>);
}
