import { type Component } from 'solid-js';

import { JSX } from "../../trmrk-solidjs/components/HOCs/withHtmlElement/typeDefs";

import { BasicHTMLAttributes } from "../../trmrk-solidjs/components/HOCs/withHtmlElement/extendedTypeDefs";
import { withHtmlElement } from "../../trmrk-solidjs/components/HOCs/withHtmlElement/withHtmlElement";

import { withRipple } from "../../trmrk-solidjs/components/HOCs/withInterceptedParent/withRipple";
import { withLongPress, WithLongPressComponentProps } from "../../trmrk-solidjs/components/HOCs/withLongPress/withLongPress";

import { LongPressEventDataTuple, LongPressEventData } from "../../trmrk-solidjs/hooks/useLongPress/useLongPress";

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

  const LongPressableRippleButton = withLongPress<typeof RippleButton, JSX.HTMLAttributes<HTMLButtonElement> & BasicHTMLAttributes & WithLongPressComponentProps>(RippleButton, { });

  return (
    <div><RippleButton class="btn btn-secondary">asdfasdf</RippleButton>
      <LongPressableRippleButton
        touchStart={onTouchStartOrMouseDown}
        mouseDown={onTouchStartOrMouseDown}
        touchEnd={onTouchEndOrMouseUp}
        mouseUp={onTouchEndOrMouseUp}
        shortPress={onShortPress}
        longPress={onLongPress}
        class="btn btn-primary">a
      </LongPressableRippleButton>
    </div>);
};

export default App;
