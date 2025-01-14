import { Component, Show, createMemo } from "solid-js";

import * as bootstrap from "bootstrap";

import { appHeaderOptionsModal, setAppHeaderOptionsModal, appHeaderOptionsContent } from "../../signals/core";
import { useAppContext } from "../../dataStore/core";
import BsIconBtn from "../BsBtn/BsIconBtn";

const AppOptionsModal: Component = () => {
  const { appData } = useAppContext();
  const appLayout = appData.appLayout;
  const appBody = appLayout.appBody;
  const options = appLayout.appHeader.options;

  const settingsClick = () => {
    const modal = appHeaderOptionsModal();

    if (modal) {
      var modalObj = bootstrap.Modal.getInstance(modal);
      modalObj?.dispose();
    }
  }

  return (<div class="modal trmrk-modal trmrk-app-options-modal" tabindex="-1" ref={el => setAppHeaderOptionsModal(el)}>
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ul class="list-group">
            <Show when={options.refreshAppPageBtn.isVisible}>
              <li class="list-group-item trmrk-action-list-group-item">
                <span class="trmrk-label">Refresh</span><BsIconBtn iconCssClass="bi bi-arrow-clockwise" btnHasNoBorder={true} /></li>
            </Show>
            <Show when={options.viewOpenTabsBtnBtn.isVisible}>
              <li class="list-group-item trmrk-action-list-group-item">
                <span class="trmrk-label">View Open Tabs</span><BsIconBtn iconCssClass="bi bi-three-dots-vertical" btnHasNoBorder={true} /></li>
            </Show>
            <Show when={appLayout.explorerPanel.isEnabled}>
              <li class="list-group-item trmrk-action-list-group-item">
                <span class="trmrk-label">Items Hierarchy</span><BsIconBtn iconCssClass="bi bi-list-nested" btnHasNoBorder={true} /></li>
            </Show>
            {appHeaderOptionsContent()}
            <Show when={options.goToSettingsPageBtn.isVisible}>
              <li class="list-group-item trmrk-action-list-group-item" onClick={settingsClick}>
                <a class="trmrk-icon-link" href={appLayout.settingsPageUrl}>
                  <span class="trmrk-label">Settings</span><BsIconBtn iconCssClass="bi bi-gear" btnHasNoBorder={true} />
                </a>
              </li>
            </Show>
          </ul>
        </div>
      </div>
    </div>
  </div>);
};

export default AppOptionsModal;
