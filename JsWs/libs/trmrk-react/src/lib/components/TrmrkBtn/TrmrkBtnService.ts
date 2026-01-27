import { NullOrUndef, actWithValIf } from "@/src/trmrk/core";

import { clearRefVal, updateRef } from "../../services/utils";

export const handleOnPointerDownFunc = (
  e: React.PointerEvent<HTMLButtonElement>,
  timeoutRef: React.RefObject<NodeJS.Timeout | null>,
  onPointerDown:
    | ((e: React.PointerEvent<HTMLButtonElement>) => void)
    | NullOrUndef,
) => {
  const btnElem = e.currentTarget;
  btnElem.classList.add("trmrk-btn-pressed");

  timeoutRef.current = setTimeout(() => {
    btnElem.classList.remove("trmrk-btn-pressed");
    timeoutRef.current = null;
  }, 200);

  actWithValIf(onPointerDown, (f) => f(e));
};

export const refElAvailableFunc = (
  el: HTMLButtonElement | null,
  rootElRef: React.RefObject<HTMLButtonElement | null>,
  ref: React.Ref<HTMLButtonElement>,
) => {
  rootElRef.current = el;
  actWithValIf(ref, (r) => updateRef(r, el));
};

export const effectCallback = (
  rootElRef: React.RefObject<HTMLButtonElement | null>,
  timeoutRef: React.RefObject<NodeJS.Timeout | null>,
) => {
  const btnElem = rootElRef!.current;

  return () => {
    clearRefVal(timeoutRef, clearTimeout);
    btnElem?.classList.remove("trmrk-btn-pressed");
  };
};
