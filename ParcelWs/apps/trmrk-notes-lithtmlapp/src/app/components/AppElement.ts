import { LitElement, html, TemplateResult } from "lit";
import { customElement, query } from "lit/decorators";
import { Router } from "@vaadin/router";

import { globalStyles } from "../domUtils/css";
import { catchAllNotFound } from "../utilities/routing";

import { appPagePropFactory, AppPage } from "../utilities/data";

import {
  AppLayoutStyles,
  showAppHeaderPropFactory,
  showAppFooterPropFactory,
  appTitlePropFactory,
} from "../../trmrk-lithtml/components/AppLayout/core";

import { icons } from "../assets/icons";

@customElement("trmrk-app")
export class AppElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value];

  protected readonly appPageProp = appPagePropFactory.createController(this);

  @query("main")
  appElem!: HTMLElement;

  router: Router | null;

  constructor() {
    super();
    this.router = null;
  }

  render() {
    let footer: TemplateResult<1> | null = null;

    switch (this.appPageProp.value) {
      case AppPage.Home:
        footer = html`<trmrk-app-home-page-footer></trmrk-app-home-page-footer>`;
        break;
      case AppPage.FolderEntriesList:
        footer = html`<trmrk-folder-entries-list-footer-page></trmrk-folder-entries-list-footer-page>`;
        break;
      default:
        break;
    }

    return html`<trmrk-app-layout>
      ${this.appPageProp.value === AppPage.Home
        ? html`<div slot="header" class="col-start-1">
            <img
              class="trmrk-app-header-icon"
              src="${icons.appHeaderIconUrl}"
            />
          </div>`
        : null}
      <main slot="body"></main>
      <div slot="footer">${footer}</div>
    </trmrk-app-layout>`;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.router?.unsubscribe();
    this.router = null;
  }

  updated() {
    this.subscribeRouterIfReq();
  }

  firstUpdated() {
    this.subscribeRouterIfReq();
  }

  subscribeRouterIfReq() {
    if (!this.router) {
      const appElem = this.renderRoot?.querySelector("main")!;
      appElem.innerText = "";
      this.router = new Router(appElem);

      this.router.setRoutes([
        {
          path: "/app",
          children: [
            {
              path: "/",
              redirect: "/app/home",
            },
            {
              path: "/home",
              component: "trmrk-app-home-page",
            },
            {
              path: "/folder-entries",
              component: "trmrk-folder-entries-list-page",
            },
            catchAllNotFound("any", 1),
          ],
        },
      ]);
    }
  }
}