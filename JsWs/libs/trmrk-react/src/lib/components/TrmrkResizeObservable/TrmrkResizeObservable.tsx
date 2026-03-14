import React from "react";

import { updateFwdRef } from "../../services/utils";

export type TrmrkResizeObservableProps<T extends React.ElementType> = {
  resized: (rootEl: HTMLElement | null, rszArgs: ResizeCallbackArgs | null) => void;
  as?: T;
} & React.ComponentPropsWithRef<T>;

export interface ResizeCallbackArgs {
  entries: ResizeObserverEntry[];
  observer: ResizeObserver;
}

const TrmrkResizeObservable = React.forwardRef((
  { resized, as, ...props }: TrmrkResizeObservableProps<'div'>,
    ref: React.ForwardedRef<HTMLElement>) => {
  const rootElRef = React.useRef<HTMLElement>(null);

  const onRootElResized = React.useCallback((rszArgs: ResizeCallbackArgs | null) => {
    resized(rootElRef.current, rszArgs);
  }, []);

  const rootElResized = React.useCallback(
    (entries: ResizeObserverEntry[],
      observer: ResizeObserver) => onRootElResized({
      entries,
      observer
    }), []);

  const observer = React.useMemo(
    () => new ResizeObserver(rootElResized), []);
  
  const rootElAvailable = React.useCallback((el: HTMLElement | null) => {
    rootElRef.current = el;
    updateFwdRef(ref, el);
    
    if (el) {
      observer.observe(el);
      onRootElResized(null);
    } else {
      observer.disconnect();
    }
  }, []);

  const Component = as ?? 'div';

  React.useEffect(() => {
    return () => {
      observer.disconnect();
    }
  }, []);

  return <Component {...props} ref={rootElAvailable} />;
});

export default TrmrkResizeObservable;
