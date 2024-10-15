import { LitElement, html } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

@customElement("trmrk-not-found-page")
export class NotFoundPageElement extends LitElement {
  static styles = [...globalStyles.value];

  render() {
    return html`<trmrk-error-page statusCode="404" statusText="Page Not Found">
    </trmrk-error-page>`;
  }
}
