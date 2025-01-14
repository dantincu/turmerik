import { Component, Show, createMemo } from "solid-js";

import { setAppHeaderOptionsModal, appHeaderOptionsContent } from "../../signals/core";

const AppOptionsModal: Component = () => {
  return (<div class="modal" tabindex="-1" ref={el => setAppHeaderOptionsModal(el)}>
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          {appHeaderOptionsContent()}
        </div>
      </div>
    </div>
  </div>);
};

export default AppOptionsModal;
