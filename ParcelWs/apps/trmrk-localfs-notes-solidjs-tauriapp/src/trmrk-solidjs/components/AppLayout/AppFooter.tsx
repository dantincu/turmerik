import { Component, Show } from "solid-js";

import { useAppContext } from "../../dataStore/core";

import BsIconBtn from "../BsBtn/BsIconBtn";

const AppFooter: Component = () => {
  const { appData } = useAppContext();
  const appLayout = appData.appLayout;

  return (<footer class="trmrk-app-footer">
    <nav class={["navbar", "trmrk-navbar", appLayout.isDarkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"].join(" ")}>
      <Show when={appLayout.appFooter.showHomeBtn}>
        <a class="trmrk-icon-link" href={appLayout.homePageUrl}>
          <BsIconBtn iconCssClass='bi bi-house' />
        </a>
      </Show>
    </nav>
  </footer>);
}

export default AppFooter;
