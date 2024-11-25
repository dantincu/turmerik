import { type Component, createEffect } from 'solid-js';

import { MtblRefValue } from "../../trmrk/core";

import LongPerssableButton from "../../trmrk-solidjs/components/HOCs/withLongPress/LongPerssableButton";

import { useLongPress, LongPressEventDataTuple, LongPressEventData } from "../../trmrk-solidjs/hooks/useLongPress/useLongPress";

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

  return (
    <div><LongPerssableButton
      touchStart={onTouchStartOrMouseDown} mouseDown={onTouchStartOrMouseDown}
      touchEnd={onTouchEndOrMouseUp} mouseUp={onTouchEndOrMouseUp}
      shortPress={onShortPress} longPress={onLongPress}
      class="btn btn-primary">asdasdf</LongPerssableButton></div>);
};

export default App;
