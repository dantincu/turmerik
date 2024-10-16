import { LitElement, html } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import {
  AppLayoutStyles,
  showAppHeaderPropFactory,
  showAppFooterPropFactory,
  appTitlePropFactory,
} from "../../../trmrk-lithtml/components/AppLayout/core";

import { icons } from "../../assets/icons";

@customElement("trmrk-app-home-page")
export class AppHomePageElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value];

  docBodyHeight: number;

  constructor() {
    super();
    this.docBodyHeight = window.innerHeight;
  }

  connectedCallback() {
    super.connectedCallback();

    showAppHeaderPropFactory.observable.value = true;
    showAppFooterPropFactory.observable.value = true;
    appTitlePropFactory.observable.value = "Turmerik Notes";
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <p>document body height: ${this.docBodyHeight}</p>
      <p>document body height: ${this.docBodyHeight}</p>
      <p>document body height: ${this.docBodyHeight}</p>
      <p>document body height: ${this.docBodyHeight}</p>
      <p style="display: block; position: absolute; bottom: 0px;">qwrqwer</p>
    `;
  }
}
