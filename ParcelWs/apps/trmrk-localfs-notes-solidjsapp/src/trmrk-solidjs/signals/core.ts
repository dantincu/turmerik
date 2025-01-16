import { createSignal, JSX } from "solid-js";

export const [appHeaderOptionsContent, setAppHeaderOptionsContent] =
  createSignal<JSX.Element | JSX.Element[] | null>(null);

export const [appHeaderOptionsModal, setAppHeaderOptionsModal] =
  createSignal<HTMLDivElement | null>(null);

export const [appHeaderOptionsPopoverEl, setAppHeaderOptionsPopoverEl] =
  createSignal<HTMLButtonElement | null>(null);

export const [appFooterContent, setAppFooterContent] = createSignal<
  JSX.Element | JSX.Element[] | null
>(null);

export const [appHiddenContent, setAppHiddenContent] = createSignal<
  JSX.Element | JSX.Element[] | null
>(null);

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
