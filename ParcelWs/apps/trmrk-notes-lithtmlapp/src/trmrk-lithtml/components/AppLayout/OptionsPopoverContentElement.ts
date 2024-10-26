import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import { AppLayoutStyles } from "./styles";

@customElement("trmrk-options-popover-content")
export class OptionsPopoverContentElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    ...AppLayoutStyles.value,
    css`
      .trmrk-options-popover-content {
      }
    `,
  ];

  render() {
    return html`<div class="trmrk-options-popover-content">
      <trmrk-bs-icon-btn btnHasNoBorder></trmrk-bs-icon-btn>
    </div>`;
  }
}
