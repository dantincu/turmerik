import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import {
  AppLayoutStyles,
  homePageUrlPropFactory,
  showAppFooterUndoRedoButtonsPropFactory,
  showAppFooterHomeButtonPropFactory,
  showAppFooterCloseSelectionButtonPropFactory,
  appFooterUndoButtonEnabledPropFactory,
  appFooterRedoButtonEnabledPropFactory,
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

  protected readonly appFooterUndoButtonEnabledProp =
    appFooterUndoButtonEnabledPropFactory.createController(this);

  protected readonly appFooterRedoButtonEnabledProp =
    appFooterRedoButtonEnabledPropFactory.createController(this);

  protected readonly showAppFooterCloseSelectionButtonProp =
    showAppFooterCloseSelectionButtonPropFactory.createController(this);

  render() {
    let buttonsCount = [
      this.showAppFooterHomeButtonProp.value ? 1 : 0,
      this.showAppTabsBarUndoRedoButtonsProp.value ? 2 : 0,
    ].reduce((a, b) => a + b);

    const footerContentCssClassesArr = [
      "trmrk-footer-content",
      `col-start-${buttonsCount + 1}`,
      this.showAppFooterCloseSelectionButtonProp.value
        ? "col-end-5"
        : "-col-end-1",
    ];

    const footerContentCssClass = footerContentCssClassesArr.join(" ");

    return html`<footer class="trmrk-app-footer">
      ${this.showAppFooterHomeButtonProp.value
        ? html`<a class="trmrk-btn-link" href="${this.homePageUrlProp.value}"
            ><trmrk-bs-icon-btn
              btnHasNoBorder
              iconCssClass="bi-house-door-fill"
            ></trmrk-bs-icon-btn
          ></a>`
        : null}
      ${this.showAppTabsBarUndoRedoButtonsProp.value
        ? html` <trmrk-bs-icon-btn
              btnHasNoBorder
              ?btnDisabled="${!this.appFooterUndoButtonEnabledProp.value}"
              iconCssClass="bi-arrow-counterclockwise"
            ></trmrk-bs-icon-btn
            ><trmrk-bs-icon-btn
              btnHasNoBorder
              ?btnDisabled="${!this.appFooterRedoButtonEnabledProp.value}"
              iconCssClass="bi-arrow-clockwise"
            ></trmrk-bs-icon-btn>`
        : null}
      <div class="${footerContentCssClass}">
        <slot name="footer"></slot>
      </div>
      ${this.showAppFooterCloseSelectionButtonProp.value
        ? html`<trmrk-bs-icon-btn
            btnHasNoBorder
            class="trmrk-display-flex col-start-5 col-end-5"
            iconCssClass="bi-x-lg"
          ></trmrk-bs-icon-btn>`
        : null}
    </footer>`;
  }
}
