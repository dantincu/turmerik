import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

@customElement("trmrk-not-found-page")
export class NotFoundPageElement extends LitElement {
  static styles = [...globalStyles.value];

  @property()
  public homePageUrl?: string;

  @property()
  public showHomePageBtn?: boolean;

  render() {
    return html`<trmrk-error-page
      statusCode="404"
      statusText="Page Not Found"
      ?homePageUrl="${this.homePageUrl}"
      ?showHomePageBtn="${(this.showHomePageBtn ?? null) !== null}"
    >
    </trmrk-error-page>`;
  }
}
