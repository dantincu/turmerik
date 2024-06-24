export class ReactEvtObjConverter<TEvt, TReactEvt> {
  toReactEvt(e: TEvt) {
    return e as unknown as TReactEvt;
  }

  toReactEvtOr<TAltInType = TEvt, TAltOutType = TReactEvt>(
    e: TEvt | TAltInType
  ) {
    return e as unknown as TReactEvt | TAltOutType;
  }

  fromReactEvntOr<TAltInType = TEvt, TAltOutType = TReactEvt>(
    e: TReactEvt | TAltInType
  ) {
    return e as unknown as TEvt | TAltOutType;
  }

  fromReactEvt(e: TReactEvt) {
    return e as unknown as TEvt;
  }
}

export type MouseOrTouchEvent = MouseEvent | TouchEvent;
export type MouseOrTouchReactEvent = React.MouseEvent | React.TouchEvent;

export const reactEvtConverters = Object.freeze({
  animation: new ReactEvtObjConverter<AnimationEvent, React.AnimationEvent>(),
  clipboard: new ReactEvtObjConverter<ClipboardEvent, React.ClipboardEvent>(),
  composition: new ReactEvtObjConverter<
    CompositionEvent,
    React.CompositionEvent
  >(),
  drag: new ReactEvtObjConverter<DragEvent, React.DragEvent>(),
  focus: new ReactEvtObjConverter<FocusEvent, React.FocusEvent>(),
  keyboard: new ReactEvtObjConverter<KeyboardEvent, React.KeyboardEvent>(),
  mouse: new ReactEvtObjConverter<MouseEvent, React.MouseEvent>(),
  touch: new ReactEvtObjConverter<TouchEvent, React.TouchEvent>(),
  pointer: new ReactEvtObjConverter<PointerEvent, React.PointerEvent>(),
  transition: new ReactEvtObjConverter<
    TransitionEvent,
    React.TransitionEvent
  >(),
  ui: new ReactEvtObjConverter<UIEvent, React.UIEvent>(),
  wheel: new ReactEvtObjConverter<WheelEvent, React.WheelEvent>(),

  mouseOrTouch: new ReactEvtObjConverter<
    MouseOrTouchEvent,
    MouseOrTouchReactEvent
  >(),
});

export const reactEvtObjConverters = Object.freeze({
  touch: new ReactEvtObjConverter<Touch, React.Touch>(),
  touchList: new ReactEvtObjConverter<TouchList, React.TouchList>(),
});
