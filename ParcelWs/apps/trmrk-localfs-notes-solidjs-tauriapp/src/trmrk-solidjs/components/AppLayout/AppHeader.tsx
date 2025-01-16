import { Component, Show, createMemo } from "solid-js";

import { useAppContext } from "../../dataStore/core";

import BsIconBtn from "../BsBtn/BsIconBtn";
import { appOptionsPopoverContentRef } from "./AppOptionsPopoverContent";

import { appHeaderOptionsPopoverEl, setAppHeaderOptionsPopoverEl } from "../../signals/core";

import * as bootstrap from "bootstrap";

const AppHeader: Component = () => {
  const { appData } = useAppContext();
  const appLayout = appData.appLayout;
  const appHeader = appLayout.appHeader;

  const btnsCount = createMemo(() => {
    let count = 0;
    if (appHeader.goToParentBtn.isVisible) count++;
    if (appHeader.showHistoryNavBtns) count += 2;
    if (appHeader.showOptionsBtn) count++;
    return count;
  });

  const goToSettingsPageClick = () => {
    const popoverEl = appHeaderOptionsPopoverEl();

    if (popoverEl) {
      const popoverObj = bootstrap.Popover.getInstance(popoverEl);
      popoverObj?.hide();
    }
  }

  const popoverShown = () => {
    const popoverEl = appHeaderOptionsPopoverEl();
    
    if (popoverEl) {
      const popoverObj = bootstrap.Popover.getInstance(popoverEl);

      if (popoverObj) {
        const rootDomElem = (popoverObj as any).tip;
        const optionElem = rootDomElem.querySelector(".trmrk-goto-settings-page-option");

        if (optionElem) {
          optionElem.addEventListener("click", goToSettingsPageClick);
        }
      }
    }
  }

  const onAppOptionsBtnAvaillable = (popoverEl: HTMLButtonElement | null) => {
    setAppHeaderOptionsPopoverEl(popoverEl);
    if (!popoverEl) return;
    
    const popover = appHeaderOptionsPopoverEl();
    let appOptionsPopoverContent = appOptionsPopoverContentRef();

    if (popover && appOptionsPopoverContent) {
      appOptionsPopoverContent = appOptionsPopoverContent.cloneNode(true) as HTMLUListElement;

      const popoverObj = new bootstrap.Popover(popover, {
        content: appOptionsPopoverContent,
        trigger: "click",
        placement: "bottom",
        html: true
      });

      popoverEl.addEventListener("inserted.bs.popover", popoverShown);
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
          ref={onAppOptionsBtnAvaillable} />
      </Show>
    </nav>
  </header>);
}

export default AppHeader;
