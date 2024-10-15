import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import {
  AppLayoutStyles,
  homePageUrlPropFactory,
  showAppFooterUndoRedoButtonsPropFactory,
  showAppFooterHomeButtonPropFactory,
} from "./core";

@customElement("trmrk-app-footer")
export class AppFooterElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    ...AppLayoutStyles.value,
    css`
      .trmrk-app-footer {
        display: grid;
        grid-template-columns: 43px 43px 43px auto 44px;
      }

      .trmrk-footer-content {
        display: flex;
      }
    `,
  ];

  protected readonly homePageUrlProp =
    homePageUrlPropFactory.createController(this);

  protected readonly showAppFooterHomeButtonProp =
    showAppFooterHomeButtonPropFactory.createController(this);

  protected readonly showAppTabsBarUndoRedoButtonsProp =
    showAppFooterUndoRedoButtonsPropFactory.createController(this);

  render() {
    let buttonsCount = [
      this.showAppFooterHomeButtonProp.value ? 1 : 0,
      this.showAppTabsBarUndoRedoButtonsProp.value ? 2 : 0,
    ].reduce((a, b) => a + b);

    return html`<footer class="trmrk-app-footer">
      ${this.showAppFooterHomeButtonProp
        ? html`<a class="trmrk-btn-link" href="${this.homePageUrlProp.value}"
            ><trmrk-bs-icon-btn
              iconCssClass="bi-house-door-fill"
            ></trmrk-bs-icon-btn
          ></a>`
        : null}
      ${this.showAppTabsBarUndoRedoButtonsProp.value
        ? html` <trmrk-bs-icon-btn
              iconCssClass="bi-arrow-counterclockwise"
            ></trmrk-bs-icon-btn
            ><trmrk-bs-icon-btn
              iconCssClass="bi-arrow-clockwise"
            ></trmrk-bs-icon-btn>`
        : null}
      <div class="trmrk-footer-content col-start-${buttonsCount + 1} col-end-5">
        <slot name="footer"></slot>
      </div>
    </footer>`;
  }
}
