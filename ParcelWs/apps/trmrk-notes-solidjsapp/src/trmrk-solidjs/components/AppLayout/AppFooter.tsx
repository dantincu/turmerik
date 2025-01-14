import { Component, Show, createMemo } from "solid-js";

import { useAppContext } from "../../dataStore/core";

import BsIconBtn from "../BsBtn/BsIconBtn";

const AppFooter: Component = () => {
  const { appData } = useAppContext();
  const appLayout = appData.appLayout;
  const appFooter = appLayout.appFooter;

  const btnsCount = createMemo(() => {
    let count = 0;
    if (appFooter.showHomeBtn) count++;
    if (appLayout.appFooter.showUndoRedoBtns) count += 2;
    return count;
  });

  return (<footer class="trmrk-app-footer">
    <nav class={["navbar", "trmrk-navbar", appLayout.isDarkMode ? "navbar-dark bg-dark" : "navbar-light bg-light", `trmrk-app-footer-has-${btnsCount()}-btns`].join(" ")}>
      <Show when={appLayout.appFooter.showHomeBtn}>
        <a class="trmrk-icon-link" href={appLayout.homePageUrl}>
          <BsIconBtn iconCssClass='bi bi-house' btnHasNoBorder={true} />
        </a>
      </Show>
      <Show when={appLayout.appFooter.showUndoRedoBtns}>
        <BsIconBtn iconCssClass='bi bi-arrow-counterclockwise' btnHasNoBorder={true} />
        <BsIconBtn iconCssClass='bi bi-arrow-clockwise' btnHasNoBorder={true} />
      </Show>
    </nav>
  </footer>);
}

export default AppFooter;
