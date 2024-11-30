import { Component, JSX, useContext } from 'solid-js';
import { produce } from "solid-js/store";

/* import { BasicHTMLAttributes } from "../../trmrk-solidjs/components/HOCs/withHtmlElement/typeDefs";
import { withHtmlElement } from "../../trmrk-solidjs/components/HOCs/withHtmlElement/withHtmlElement";

import { RippleBackColor, withRipple } from "../../trmrk-solidjs/components/HOCs/withInterceptedParent/withRipple";
import { withLongPress, WithLongPressComponentProps } from "../../trmrk-solidjs/components/HOCs/withLongPress/withLongPress";

import { LongPressEventDataTuple, LongPressEventData } from "../../trmrk-solidjs/hooks/useLongPress/useLongPress";

import Loading from "../../trmrk-solidjs/components/Loading/Loading";

import BsBtn from "../../trmrk-solidjs/components/BsBtn/BsBtn";
import BsIconBtn from "../../trmrk-solidjs/components/BsBtn/BsIconBtn"; */

import AppLayout from "../../trmrk-solidjs/components/AppLayout/AppLayout";

import { AppData } from "../dataStore/core";

import { useAppContext } from "../dataStore/AppContext";

import { setAppBodyPanel1Content, setAppBodyPanel2Content, setAppBodyPanel3Content, setAppBodyPanel4Content } from "../../trmrk-solidjs/signals/core";
import { SplitPanelOrientation } from '../../trmrk-solidjs/dataStore/core';

const App: Component = () => {
  /* const onTouchStartOrMouseDown = (evt: LongPressEventDataTuple) => {
    // console.log("onTouchStartOrMouseDown", evt);
  };

  const onTouchEndOrMouseUp = (evt: LongPressEventDataTuple) => {
    // console.log("onTouchEndOrMouseUp", evt);
  };

  const onShortPress = (evt: LongPressEventDataTuple) => {
    // console.log("onShortPress", evt);
  };

  const onLongPress = (evt: LongPressEventData) => {
    // console.log("onLongPress", evt);
  };

  const Button = withHtmlElement({
    tagName: "button"
  });

  // @ts-ignore
  const RippleButton = withRipple<typeof Button, JSX.HTMLAttributes<HTMLButtonElement> & BasicHTMLAttributes>(Button, {});
  // @ts-ignore
  const GrayBgRippleButton = withRipple<typeof Button, JSX.HTMLAttributes<HTMLButtonElement> & BasicHTMLAttributes>(Button, {
    rippleBackColor: RippleBackColor.Gray
  });
  // @ts-ignore
  const BlackBgRippleButton = withRipple<typeof Button, JSX.HTMLAttributes<HTMLButtonElement> & BasicHTMLAttributes>(Button, {
    rippleBackColor: RippleBackColor.Dark
  });

  const LongPressableRippleButton = withLongPress<typeof RippleButton, JSX.HTMLAttributes<HTMLButtonElement> & BasicHTMLAttributes & WithLongPressComponentProps>(RippleButton, { });

  return (
    <div>
      <button class="btn btn-outline-light"><i class="bi bi-house"></i></button>
      <RippleButton class="btn btn-secondary">asdfasdf</RippleButton>
      <LongPressableRippleButton
        touchStart={onTouchStartOrMouseDown}
        mouseDown={onTouchStartOrMouseDown}
        touchEnd={onTouchEndOrMouseUp}
        mouseUp={onTouchEndOrMouseUp}
        shortPress={onShortPress}
        longPress={onLongPress}
        class="btn btn-primary">a
      </LongPressableRippleButton>
      <GrayBgRippleButton class="btn btn-secondary" >qwer</GrayBgRippleButton>
      <BlackBgRippleButton class="btn btn-secondary">qwer</BlackBgRippleButton>
      <BsBtn>asdfasdf</BsBtn>
      <BsIconBtn iconCssClass="bi bi-house" />
      <Loading />
      <BsBtn btnHasNoBorder={true}>asdfasdf</BsBtn>
      <BsIconBtn iconCssClass="bi bi-house" />
      <BsIconBtn btnHasNoBorder={true} iconCssClass="bi bi-arrow-90deg-left" />
      <BsBtn>asdfasdf</BsBtn>
      <BsIconBtn iconCssClass="bi bi-arrow-90deg-right" />
    </div>); */

  setAppBodyPanel1Content(<p>asdfasdf</p>);
  setAppBodyPanel2Content(<p>qwerqwer</p>);
  setAppBodyPanel3Content(<p>zxczxvcz</p>);
  setAppBodyPanel4Content(<p>tyuityui</p>);

  const { appData, setAppDataFull, setAppData } = useAppContext();

  const updateDraft = produce((draft: AppData) => {
    const appBody = draft.appLayout.appBody;
    appBody.splitOrientation = SplitPanelOrientation.Vertical;
    appBody.firstContainerIsFurtherSplit = true;
    appBody.secondContainerIsFurtherSplit = true;
  });

  setAppDataFull(updateDraft);

  return (<AppLayout />);
};

export default App;
