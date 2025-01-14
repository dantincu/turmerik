import { Component, Show, createMemo } from "solid-js";

import { useAppContext } from "../../dataStore/core";

import BsIconBtn from "../BsBtn/BsIconBtn";

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

  return (<header class="trmrk-app-header">
    <nav class={["navbar", "trmrk-navbar", appLayout.isDarkMode ? "navbar-dark bg-dark" : "navbar-light bg-light", `trmrk-app-header-has-${btnsCount()}-btns`].join(" ")}>
      <Show when={appHeader.goToParentBtn.isVisible}>
        <BsIconBtn iconCssClass="bi bi-arrow-up" isDisabled={!appHeader.goToParentBtn.isEnabled} />
      </Show>
      <Show when={appHeader.showHistoryNavBtns}>
        <BsIconBtn iconCssClass="bi bi-arrow-left" isDisabled={!appHeader.historyBackBtnEnabled} />
        <BsIconBtn iconCssClass="bi bi-arrow-right" isDisabled={!appHeader.historyForwardBtnEnabled} />
      </Show>
      <Show when={appHeader.showOptionsBtn}>
        <BsIconBtn iconCssClass="bi bi-three-dots-vertical" />
      </Show>
      <div></div>
    </nav>
  </header>);
}

export default AppHeader;
