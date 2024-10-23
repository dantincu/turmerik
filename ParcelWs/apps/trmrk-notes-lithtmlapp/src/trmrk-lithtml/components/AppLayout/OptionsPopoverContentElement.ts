import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import { AppLayoutStyles } from "./core";

@customElement("trmrk-options-popover-content")
export class OptionsPopoverContentElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    ...AppLayoutStyles.value,
    css`
      .trmrk-options-popover-content {
        /* width: calc(100vw - 100px); */
      }
    `,
  ];

  render() {
    return html`<div class="trmrk-options-popover-content">asdfasdfsdaf</div>`;
  }
}
