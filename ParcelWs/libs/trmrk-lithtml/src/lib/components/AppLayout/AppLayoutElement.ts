import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { isDarkModePropValFactory } from "../../domUtils/core";

@customElement("trmrk-app-layout")
export class AppLayoutElement extends LitElement {
  protected isDarkModePropVal = isDarkModePropValFactory.createController(this);

  render() {
    return html`${this.isDarkModePropVal.observable.value}<trmrk-app-tabs-bar
      ></trmrk-app-tabs-bar>`;
  }
}
