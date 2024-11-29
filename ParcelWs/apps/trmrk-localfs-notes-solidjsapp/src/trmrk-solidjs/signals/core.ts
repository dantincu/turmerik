import { createSignal } from "solid-js";

export const [appHeaderOptiosBtnDomElem, setAppHeaderOptiosBtnDomElem] =
  createSignal<HTMLElement | null>(null);

export const [appLayoutRootDomElem, setAppLayoutRootDomElem] =
  createSignal<HTMLDivElement | null>(null);
