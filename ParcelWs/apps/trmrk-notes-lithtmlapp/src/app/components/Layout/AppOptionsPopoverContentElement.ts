import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import { AppLayoutStyles } from "../../../trmrk-lithtml/components/AppLayout/styles";

@customElement("trmrk-app-options-popover-content")
export class AppOptionsPopoverContentElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value, css``];

  render() {
    return html`<trmrk-options-popover-content>
    </trmrk-options-popover-content>`;
  }
}
