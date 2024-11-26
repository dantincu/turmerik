import { type Component, createEffect } from 'solid-js';

import { JSX } from "../../trmrk-solidjs/components/htmlElementWrappers/typeDefs";

import { BasicHTMLAttributes } from "../../trmrk-solidjs/components/htmlElementWrappers/extendedTypeDefs";

import Button from "../../trmrk-solidjs/components/htmlElementWrappers/Button";
import { withRipple } from "../../trmrk-solidjs/components/HOCs/withInteractiveOverlay/withRipple";
import { withLongPress } from "../../trmrk-solidjs/components/HOCs/withLongPress/withLongPress";

import { LongPressEventDataTuple, LongPressEventData } from "../../trmrk-solidjs/hooks/useLongPress/useLongPress";

const App: Component = () => {
  const onTouchStartOrMouseDown = (evt: LongPressEventDataTuple) => {
    console.log("onTouchStartOrMouseDown", evt);
  };

  const onTouchEndOrMouseUp = (evt: LongPressEventDataTuple) => {
    console.log("onTouchEndOrMouseUp", evt);
  };

  const onShortPress = (evt: LongPressEventDataTuple) => {
    console.log("onShortPress", evt);
  };

  const onLongPress = (evt: LongPressEventData) => {
    console.log("onLongPress", evt);
  };

  const RippleButton = withRipple<typeof Button, JSX.HTMLAttributes<HTMLButtonElement> & BasicHTMLAttributes>(Button, {});

  const LongPressableRippleButton = withLongPress(RippleButton, { });

  return (
    <div><RippleButton class="btn btn-secondary">asdfasdf</RippleButton><LongPressableRippleButton
      // @ts-ignore
      touchStart={onTouchStartOrMouseDown}
      mouseDown={onTouchStartOrMouseDown}
      touchEnd={onTouchEndOrMouseUp}
      mouseUp={onTouchEndOrMouseUp}
      shortPress={onShortPress}
      longPress={onLongPress}
      class="btn btn-primary">asdasdf</LongPressableRippleButton></div>);

   /* return (
    <div><RippleButton class="btn btn-secondary relative">a</RippleButton></div>
   ); */

   // return <div></div>
};

export default App;
