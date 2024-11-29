import { Component, JSX } from 'solid-js';

import { BasicHTMLAttributes } from "../../trmrk-solidjs/components/HOCs/withHtmlElement/typeDefs";
import { withHtmlElement } from "../../trmrk-solidjs/components/HOCs/withHtmlElement/withHtmlElement";

import { RippleBackColor, withRipple } from "../../trmrk-solidjs/components/HOCs/withInterceptedParent/withRipple";
import { withLongPress, WithLongPressComponentProps } from "../../trmrk-solidjs/components/HOCs/withLongPress/withLongPress";

import { LongPressEventDataTuple, LongPressEventData } from "../../trmrk-solidjs/hooks/useLongPress/useLongPress";

import Loading from "../../trmrk-solidjs/components/Loading/Loading";

import BsBtn from "../../trmrk-solidjs/components/BsBtn/BsBtn";
import BsIconBtn from "../../trmrk-solidjs/components/BsBtn/BsIconBtn";

const App: Component = () => {
  const onTouchStartOrMouseDown = (evt: LongPressEventDataTuple) => {
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
      <BsIconBtn iconClassName="bi bi-house" />
      <Loading />
      <BsBtn>asdfasdf</BsBtn>
      <BsIconBtn iconClassName="bi bi-arrow-90deg-left" />
      <BsBtn>asdfasdf</BsBtn>
      <BsIconBtn iconClassName="bi bi-arrow-90deg-right" />
    </div>);
};

export default App;
