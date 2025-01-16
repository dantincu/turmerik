import { Component, Show, createSignal } from "solid-js";

import * as bootstrap from "bootstrap";

import { appHeaderOptionsPopoverEl, appHeaderOptionsContent } from "../../signals/core";
import { useAppContext } from "../../dataStore/core";
import BsIconBtn from "../BsBtn/BsIconBtn";

export const [ appOptionsPopoverContentRef, setAppOptionsPopoverContentRef ] = createSignal<HTMLUListElement | null>(null);

const AppOptionsPopoverContent: Component = () => {
  const { appData } = useAppContext();
  const appLayout = appData.appLayout;
  const options = appLayout.appHeader.options;

  return (<ul class="list-group" ref={el => setAppOptionsPopoverContentRef(el)}>
      <Show when={options.refreshAppPageBtn.isVisible}>
        <li class="list-group-item trmrk-action-list-group-item trmrk-refresh-option">
          <span class="trmrk-label">Refresh</span><BsIconBtn iconCssClass="bi bi-arrow-clockwise" btnHasNoBorder={true} /></li>
      </Show>
      <Show when={options.viewOpenTabsBtnBtn.isVisible}>
        <li class="list-group-item trmrk-action-list-group-item trmrk-view-open-tabs-option">
          <span class="trmrk-label">Show Open Tabs</span><BsIconBtn iconCssClass="bi bi-three-dots-vertical" btnHasNoBorder={true} /></li>
      </Show>
      <Show when={appLayout.explorerPanel.isEnabled}>
        <li class="list-group-item trmrk-action-list-group-item trmrk-items-hierarchy-option">
          <span class="trmrk-label">Items Hierarchy</span><BsIconBtn iconCssClass="bi bi-list-nested" btnHasNoBorder={true} /></li>
      </Show>
      {appHeaderOptionsContent()}
      <Show when={options.goToSettingsPageBtn.isVisible}>
        <li class="list-group-item trmrk-action-list-group-item trmrk-goto-settings-page-option">
          <a class="trmrk-icon-link" href={appLayout.settingsPageUrl}>
            <span class="trmrk-label">Settings</span><BsIconBtn iconCssClass="bi bi-gear" btnHasNoBorder={true} />
          </a>
        </li>
      </Show>
    </ul>);
};

export default AppOptionsPopoverContent;

