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

export default function CodeTextCursorPositioningPage(
  props: CodeTextCursorPositioningProps
) {
  const textBox1ElRef = React.createRef<HTMLInputElement>();
  const textArea1ElRef = React.createRef<HTMLTextAreaElement>();
  const textBox2ElRef = React.createRef<HTMLInputElement>();
  const textArea2ElRef = React.createRef<HTMLTextAreaElement>();

  const [ textBoxEl1, setTextBox1El ] = React.useState(textBox1ElRef.current);
  const [ textArea1El, setTextArea1El ] = React.useState(textArea1ElRef.current);

  const [ textBoxEl2, setTextBox2El ] = React.useState(textBox2ElRef.current);
  const [ textArea2El, setTextArea2El ] = React.useState(textArea2ElRef.current);

  const [ textBox1IsReadonly, setTextBox1IsReadonly ] = React.useState(true);
  const [ textArea1IsReadonly, setText1AreaIsReadonly ] = React.useState(true);

  const [ textBox2IsReadonly, setTextBox2IsReadonly ] = React.useState(true);
  const [ textArea2IsReadonly, setText2AreaIsReadonly ] = React.useState(true);

  const [ showSinglelineText1CaretPositioner, setShowSinglelineText1CaretPositioner ] = React.useState(false);
  const [ showMultilineText1CaretPositioner, setShowMultilineText1CaretPositioner ] = React.useState(false);

  const [ showSinglelineText2CaretPositioner, setShowSinglelineText2CaretPositioner ] = React.useState(false);
  const [ showMultilineText2CaretPositioner, setShowMultilineText2CaretPositioner ] = React.useState(false);

  const isDarkMode = useSelector(appDataSelectors.getIsDarkMode);

  const textObj = generateText();

  const [ singlelineText1, setSinglelineText1 ] = React.useState(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`);

  const [ multilineText1, setMultilineText1 ] = React.useState(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`);

  const [ singlelineText2, setSinglelineText2 ] = React.useState(textObj[0]);
  const [ multilineText2, setMultilineText2 ] = React.useState(textObj[1]);

  const onSingleLineText1Changed = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSinglelineText1(e.target.value);
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

  const onShowSinglelineText1CaretPositioner = () => {
    setShowSinglelineText1CaretPositioner(true);
  }

  const onHideSinglelineTextBox1CaretPositioner = () => {
    setShowSinglelineText1CaretPositioner(false);
  }

  const onShowMultilineText1CaretPositioner = () => {
    setShowMultilineText1CaretPositioner(true);
  }

  const onHideMultilineTextBox1CaretPositioner = () => {
    setShowMultilineText1CaretPositioner(false);
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

  const onShowSinglelineText2CaretPositioner = () => {
    setShowSinglelineText2CaretPositioner(true);
  }

  const onHideSinglelineTextBox2CaretPositioner = () => {
    setShowSinglelineText2CaretPositioner(false);
  }

  const onShowMultilineText2CaretPositioner = () => {
    setShowMultilineText2CaretPositioner(true);
  }

  const onHideMultilineTextBox2CaretPositioner = () => {
    setShowMultilineText2CaretPositioner(false);
  }

  React.useEffect(() => {
    if (textBox1ElRef.current !== textBoxEl1) {
      setTextBox1El(textBox1ElRef.current);
    }

    if (textArea1ElRef.current !== textArea1El) {
      setTextArea1El(textArea1ElRef.current);
    }

    if (textBox2ElRef.current !== textBoxEl2) {
      setTextBox2El(textBox2ElRef.current);
    }

    if (textArea2ElRef.current !== textArea2El) {
      setTextArea2El(textArea2ElRef.current);
    }
  }, [
    textBox1ElRef,
    textBoxEl1,
    textArea1ElRef,
    textArea1El,
    textBox2ElRef,
    textBoxEl2,
    textArea2ElRef,
    textArea2El,
    textBox2IsReadonly,
    textArea2IsReadonly,
    showSinglelineText2CaretPositioner,
    showMultilineText2CaretPositioner,
    isDarkMode,
    singlelineText2,
    multilineText2 ]);

  return (<AppBarsPanel basePath={props.basePath}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}>
    <div className="trmrk-block trmrk-horiz-padded">
      <label>Readonly <Checkbox onChange={onTextBox1IsReadonlyChanged} checked={textBox1IsReadonly} /></label>
      <Input ref={textBox1ElRef} onChange={onSingleLineText1Changed} value={singlelineText1} readOnly={textBox1IsReadonly} />
      <IconButton onClick={onShowSinglelineText1CaretPositioner}><MatUIIcon iconName="highlight_text_cursor" /></IconButton>
    </div>
    <div className="trmrk-block trmrk-horiz-padded">
      <Box className="trmrk-full-width trmrk-full-height"></Box>
    </div>
    <div className="trmrk-block trmrk-horiz-padded">
      <label>Readonly <Checkbox onChange={onTextArea1IsReadonlyChanged} checked={textArea1IsReadonly} /></label>
      <Input ref={textArea1ElRef} onChange={onMultiLineText1Changed} value={multilineText1} multiline rows={4} readOnly={textArea1IsReadonly} />
      <IconButton onClick={onShowMultilineText1CaretPositioner}><MatUIIcon iconName="highlight_text_cursor" /></IconButton>
    </div>
    <div className="trmrk-block trmrk-horiz-padded">
      <label>Readonly <Checkbox onChange={onTextBox2IsReadonlyChanged} checked={textBox2IsReadonly} /></label>
      <Input ref={textBox2ElRef} onChange={onSingleLineText2Changed} value={singlelineText2} readOnly={textBox2IsReadonly} />
      <IconButton onClick={onShowSinglelineText2CaretPositioner}><MatUIIcon iconName="highlight_text_cursor" /></IconButton>
    </div>
    <div className="trmrk-block trmrk-horiz-padded">
      <Box className="trmrk-full-width trmrk-full-height"></Box>
    </div>
    <div className="trmrk-block trmrk-horiz-padded">
      <label>Readonly <Checkbox onChange={onTextArea2IsReadonlyChanged} checked={textArea2IsReadonly} /></label>
      <Input ref={textArea2ElRef} onChange={onMultiLineText2Changed} value={multilineText2} multiline rows={4} readOnly={textArea2IsReadonly} />
      <IconButton onClick={onShowMultilineText2CaretPositioner}><MatUIIcon iconName="highlight_text_cursor" /></IconButton>
    </div>

    { textBoxEl1 ? <TrmrkTextCaretPositionerModal
      isOpen={showSinglelineText1CaretPositioner}
      isDarkMode={isDarkMode}
      handleClose={onHideSinglelineTextBox1CaretPositioner}
      positioner={{
        text: singlelineText1,
        textIsReadonly: textBox1IsReadonly,
        onCancelChangesClick: onHideSinglelineTextBox1CaretPositioner,
        onSubmitChangesClick: onHideSinglelineTextBox1CaretPositioner
      }} /> : null }

      { textArea1El ? <TrmrkTextCaretPositionerModal
        isOpen={showMultilineText1CaretPositioner}
        isDarkMode={isDarkMode}
        handleClose={onHideMultilineTextBox1CaretPositioner}
        positioner={{
          text: multilineText1,
          textIsReadonly: textArea1IsReadonly,
          textIsMultiline: true,
          onCancelChangesClick: onHideMultilineTextBox1CaretPositioner,
          onSubmitChangesClick: onHideMultilineTextBox1CaretPositioner
        }} /> : null }

    { textBoxEl2 ? <TrmrkTextCaretPositionerModal
      isOpen={showSinglelineText2CaretPositioner}
      isDarkMode={isDarkMode}
      handleClose={onHideSinglelineTextBox2CaretPositioner}
      positioner={{
        text: singlelineText2,
        textIsReadonly: textBox2IsReadonly,
        onCancelChangesClick: onHideSinglelineTextBox2CaretPositioner,
        onSubmitChangesClick: onHideSinglelineTextBox2CaretPositioner
      }} /> : null }

      { textArea2El ? <TrmrkTextCaretPositionerModal
        isOpen={showMultilineText2CaretPositioner}
        isDarkMode={isDarkMode}
        handleClose={onHideMultilineTextBox2CaretPositioner}
        positioner={{
          text: multilineText2,
          textIsReadonly: textArea2IsReadonly,
          textIsMultiline: true,
          onCancelChangesClick: onHideMultilineTextBox2CaretPositioner,
          onSubmitChangesClick: onHideMultilineTextBox2CaretPositioner
        }} /> : null }
  </AppBarsPanel>);
}
