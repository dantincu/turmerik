import { ParentComponent, createEffect, JSX } from 'solid-js';

import { MtblRefValue } from "../../../../trmrk/core";

import { useLongPress, LongPressEventDataTuple, LongPressEventData, UseLongPressPropsCore } from "../../../hooks/useLongPress/useLongPress";

export interface WithLongPressProps extends UseLongPressPropsCore {
  ref?: (el: HTMLElement | null) => void;
}

export interface WithLongPressComponentProps {
  touchStart?: ((evt: LongPressEventDataTuple) => void) | null | undefined;
  touchMove?: ((evt: LongPressEventDataTuple) => void) | null | undefined;
  touchEnd?: ((evt: LongPressEventDataTuple) => void) | null | undefined;
  mouseDown?: ((evt: LongPressEventDataTuple) => void) | null | undefined;
  mouseMove?: ((evt: LongPressEventDataTuple) => void) | null | undefined;
  mouseUp?: ((evt: LongPressEventDataTuple) => void) | null | undefined;
  shortPress?: ((evt: LongPressEventDataTuple) => void) | null | undefined;
  longPress?: ((evt: LongPressEventData) => void) | null | undefined;
}

export const withLongPress = <TComponent extends ParentComponent<P>, P extends Record<string, any> & WithLongPressComponentProps>(
  InputComponent: TComponent | ((props: P) => JSX.Element),
  hcoProps: WithLongPressProps): ParentComponent<P> => {
  return (props) => {
    const elemRef: MtblRefValue<HTMLElement | null> = {
      value: null
    };

    const pps = props as P;

    const onTouchStart = (evt: LongPressEventDataTuple) => {
      if (pps.touchStart) {
        pps.touchStart(evt);
      }
    }

    const onTouchMove = (evt: LongPressEventDataTuple) => {
      if (pps.touchMove) {
        pps.touchMove(evt);
      }
    }

    const onTouchEnd = (evt: LongPressEventDataTuple) => {
      if (pps.touchEnd) {
        pps.touchEnd(evt);
      }
    }

    const onMouseDown = (evt: LongPressEventDataTuple) => {
      if (pps.mouseDown) {
        pps.mouseDown(evt);
      }
    }

    const onMouseMove = (evt: LongPressEventDataTuple) => {
      if (pps.mouseMove) {
        pps.mouseMove(evt);
      }
    }

    const onMouseUp = (evt: LongPressEventDataTuple) => {
      if (pps.mouseUp) {
        pps.mouseUp(evt);
      }
    }

    const onShortPress = (evt: LongPressEventDataTuple) => {
      if (pps.shortPress) {
        pps.shortPress(evt);
      }
    }

    const onLongPress = (evt: LongPressEventData) => {
      if (pps.longPress) {
        pps.longPress(evt);
      }
    }

    const assignRef = (el: HTMLElement | null) => {
      elemRef.value = el;

      if (pps.ref) {
        pps.ref(el); // Forward the ref
      }

      if (hcoProps.ref) {
        hcoProps.ref(el); // Forward the ref
      }
    };

    const elemLongPress = useLongPress({
      domElemFactory: () => elemRef.value!,
      treatRightClickAsLongPress: hcoProps.treatRightClickAsLongPress,
      longPressIntervalMillis: hcoProps.longPressIntervalMillis,
      touchOrMouseMoveMinPx: hcoProps.touchOrMouseMoveMinPx
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

    return (<InputComponent {...pps} ref={assignRef}>
      {props.children}
    </InputComponent>);
  };
}
