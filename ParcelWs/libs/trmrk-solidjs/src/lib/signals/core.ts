import { createSignal, JSX } from "solid-js";

export const [appHeaderOptiosBtnDomElem, setAppHeaderOptiosBtnDomElem] =
  createSignal<HTMLElement | null>(null);

export const [appLayoutRootDomElem, setAppLayoutRootDomElem] =
  createSignal<HTMLDivElement | null>(null);

export const [appBodyPanel1Content, setAppBodyPanel1Content] = createSignal<
  JSX.Element | JSX.Element[] | null
>(null);

export const [appBodyPanel2Content, setAppBodyPanel2Content] = createSignal<
  JSX.Element | JSX.Element[] | null
>(null);

export const [appBodyPanel3Content, setAppBodyPanel3Content] = createSignal<
  JSX.Element | JSX.Element[] | null
>(null);

export const [appBodyPanel4Content, setAppBodyPanel4Content] = createSignal<
  JSX.Element | JSX.Element[] | null
>(null);
