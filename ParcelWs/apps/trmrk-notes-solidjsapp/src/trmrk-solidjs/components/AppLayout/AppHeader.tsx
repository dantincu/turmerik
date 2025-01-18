import { Component, Show, createMemo, createSignal, createEffect } from "solid-js";

import { useAppContext } from "../../dataStore/core";

import BsIconBtn from "../BsBtn/BsIconBtn";
import { appOptionsPopoverContentRef } from "./AppOptionsPopoverContent";

import { appHeaderOptionsPopoverEl, setAppHeaderOptionsPopoverEl } from "../../signals/core";

import * as bootstrap from "bootstrap";

const AppHeader: Component = () => {
  const { appData } = useAppContext();
  const appLayout = appData.appLayout;
  const appHeader = appLayout.appHeader;

  let appOptionsPopoverEl: HTMLDivElement | null = null;
  let appOptionsPopoverObj: bootstrap.Popover | null = null;

  const btnsCount = createMemo(() => {
    let count = 0;
    if (appHeader.goToParentBtn.isVisible) count++;
    if (appHeader.showHistoryNavBtns) count += 2;
    if (appHeader.showOptionsBtn) count++;
    return count;
  });

  const hidePopover = () => {
    if (appOptionsPopoverObj) {
      appOptionsPopoverObj.hide();
      appOptionsPopoverObj = null;
    }
  }

  const documentClick = (evt: MouseEvent | TouchEvent) => {
    const popoverEl = appHeaderOptionsPopoverEl();

    if (popoverEl && appOptionsPopoverEl && !appOptionsPopoverEl.contains(evt.target as Node) && !popoverEl.contains(evt.target as Node)) {
      hidePopover();

      document.removeEventListener("mousedown", documentClick);
      document.removeEventListener("touchstart", documentClick);
    }
  }

  const goToSettingsPageClick = () => {
    hidePopover();
  }

  const popoverShown = () => {
    const popoverEl = appHeaderOptionsPopoverEl();
    
    if (popoverEl) {
      document.addEventListener("mousedown", documentClick);
      document.addEventListener("touchstart", documentClick);

      const popoverObj = bootstrap.Popover.getInstance(popoverEl);

      if (popoverObj) {
        const rootDomElem = (popoverObj as any).tip;
        appOptionsPopoverEl = rootDomElem;
        const optionElem = rootDomElem.querySelector(".trmrk-goto-settings-page-option");

        if (optionElem) {
          optionElem.addEventListener("click", goToSettingsPageClick);
        }
      }
    }
  }

  const appOptionsBtnClick = (ev: MouseEvent | TouchEvent) => {
    if (appOptionsPopoverObj) {
      hidePopover();
    } else {
      const appOptionsPopoverContent = appOptionsPopoverContentRef();
      const popoverEl = appHeaderOptionsPopoverEl();

      if (popoverEl && appOptionsPopoverContent) {
        const appOptionsPopoverContentClone = appOptionsPopoverContent.cloneNode(true) as HTMLUListElement;

        const popoverObj = new bootstrap.Popover(popoverEl, {
          content: appOptionsPopoverContentClone,
          trigger: "manual",
          placement: "bottom",
          html: true
        });

        appOptionsPopoverObj = popoverObj;

        popoverEl.addEventListener("shown.bs.popover", popoverShown);
        popoverObj.show();
      }
    }
  }

  return (<header class="trmrk-app-header">
    <nav class={["navbar", "trmrk-navbar", appLayout.isDarkMode ? "navbar-dark bg-dark" : "navbar-light bg-light", `trmrk-app-header-has-${btnsCount()}-btns`].join(" ")}>
      <Show when={appHeader.goToParentBtn.isVisible}>
        <BsIconBtn iconCssClass="bi bi-arrow-up" btnHasNoBorder={true} isDisabled={!appHeader.goToParentBtn.isEnabled} />
      </Show>
      <Show when={appHeader.showHistoryNavBtns}>
        <BsIconBtn iconCssClass="bi bi-arrow-left" btnHasNoBorder={true} isDisabled={!appHeader.historyBackBtnEnabled} />
        <BsIconBtn iconCssClass="bi bi-arrow-right" btnHasNoBorder={true} isDisabled={!appHeader.historyForwardBtnEnabled} />
      </Show>
      <Show when={appHeader.showOptionsBtn}>
        <BsIconBtn iconCssClass="bi bi-three-dots-vertical" btnHasNoBorder={true}
          onClick={appOptionsBtnClick} ref={el => setAppHeaderOptionsPopoverEl(el)} />
      </Show>
    </nav>
  </header>);
}

export default AppHeader;
