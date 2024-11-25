import { type Component, createEffect } from 'solid-js';

import { MtblRefValue } from "../../../../trmrk/core";

import { useLongPress, LongPressEventDataTuple, LongPressEventData, UseLongPressPropsCore } from "../../../hooks/useLongPress/useLongPress";

export interface WithLongPressProps extends UseLongPressPropsCore {
  touchStart?: ((evt: LongPressEventDataTuple) => void) | null | undefined;
  touchMove?: ((evt: LongPressEventDataTuple) => void) | null | undefined;
  touchEnd?: ((evt: LongPressEventDataTuple) => void) | null | undefined;
  mouseDown?: ((evt: LongPressEventDataTuple) => void) | null | undefined;
  mouseMove?: ((evt: LongPressEventDataTuple) => void) | null | undefined;
  mouseUp?: ((evt: LongPressEventDataTuple) => void) | null | undefined;
  shortPress?: ((evt: LongPressEventDataTuple) => void) | null | undefined;
  longPress?: ((evt: LongPressEventData) => void) | null | undefined;
}

export const withLongPress = <TComponent extends Component<P>, P extends Record<string, any> | WithLongPressProps>(InputComponent: TComponent) => {
  return (props: P) => {
    const elemRef: MtblRefValue<HTMLElement | null> = {
      value: null
    };

    const onTouchStart = (evt: LongPressEventDataTuple) => {
      if (props.touchStart) {
        props.touchStart(evt);
      }
    }

    const onTouchMove = (evt: LongPressEventDataTuple) => {
      if (props.touchMove) {
        props.touchMove(evt);
      }
    }

    const onTouchEnd = (evt: LongPressEventDataTuple) => {
      if (props.touchEnd) {
        props.touchEnd(evt);
      }
    }

    const onMouseDown = (evt: LongPressEventDataTuple) => {
      if (props.mouseDown) {
        props.mouseDown(evt);
      }
    }

    const onMouseMove = (evt: LongPressEventDataTuple) => {
      if (props.mouseMove) {
        props.mouseMove(evt);
      }
    }

    const onMouseUp = (evt: LongPressEventDataTuple) => {
      if (props.mouseUp) {
        props.mouseUp(evt);
      }
    }

    const onShortPress = (evt: LongPressEventDataTuple) => {
      if (props.shortPress) {
        props.shortPress(evt);
      }
    }

    const onLongPress = (evt: LongPressEventData) => {
      if (props.longPress) {
        props.longPress(evt);
      }
    }

    const elemLongPress = useLongPress({
      domElemFactory: () => elemRef.value!,
      treatRightClickAsLongPress: props.treatRightClickAsLongPress,
      longPressIntervalMillis: props.longPressIntervalMillis,
      touchOrMouseMoveMinPx: props.touchOrMouseMoveMinPx
    });

    createEffect(() => {
      elemLongPress.touchStartEventListeners.subscribe(onTouchStart);
      elemLongPress.touchMoveEventListeners.subscribe(onTouchMove);
      elemLongPress.touchEndEventListeners.subscribe(onTouchEnd);
      elemLongPress.mouseDownEventListeners.subscribe(onMouseDown);
      elemLongPress.mouseMoveEventListeners.subscribe(onMouseMove);
      elemLongPress.mouseUpEventListeners.subscribe(onMouseUp);
      elemLongPress.shortPressEventListeners.subscribe(onShortPress);
      elemLongPress.longPressEventListeners.subscribe(onLongPress);

      elemLongPress.subscribeToDomElem();

      return () => {
        elemLongPress.unsubscribeFromDomElem();
      }
    }, [elemRef.value]);

    return <InputComponent ref={(el: HTMLElement) => elemRef.value = el} {...props} />
  };
}
