import { Component, Show, createMemo } from "solid-js";

import { useAppContext } from "../../dataStore/core";

import BsIconBtn from "../BsBtn/BsIconBtn";

const AppFooter: Component = () => {
  const { appData } = useAppContext();
  const appLayout = appData.appLayout;
  const appFooter = appLayout.appFooter;

  const btnsCount = createMemo(() => {
    let count = 0;
    if (appFooter.showSaveBtn) count++;
    if (appLayout.appFooter.showUndoRedoBtns) count += 2;
    return count;
  });

  return (<footer class="trmrk-app-footer">
    <nav class={["navbar", "trmrk-navbar", appLayout.isDarkMode ? "navbar-dark bg-dark" : "navbar-light bg-light", `trmrk-app-footer-has-${btnsCount()}-btns`].join(" ")}>
      <Show when={appLayout.appFooter.showSaveBtn}>
        <BsIconBtn iconCssClass='ri ri-save-line' btnHasNoBorder={true} />
      </Show>
      <Show when={appLayout.appFooter.showUndoRedoBtns}>
        <BsIconBtn iconCssClass='ri ri-arrow-go-back-line' btnHasNoBorder={true} />
        <BsIconBtn iconCssClass='ri ri-arrow-go-forward-line' btnHasNoBorder={true} />
      </Show>
    </nav>
  </footer>);
}

export default AppFooter;
