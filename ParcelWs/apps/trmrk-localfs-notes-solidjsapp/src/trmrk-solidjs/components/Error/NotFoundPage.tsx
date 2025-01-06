import { Component } from 'solid-js';

import Caption from "../common/Caption";
import UIMessage from "../common/UIMessage";

import BsIconBtn from "../BsBtn/BsIconBtn";

import { useAppContext } from "../../dataStore/core";

export interface NotFoundPageProps {
}

const NotFoundPage: Component<NotFoundPageProps> = (props: NotFoundPageProps) => {
  const { appData } = useAppContext();
  const appLayout = appData.appLayout;

  return (<div class="trmrk-basic-page trmrk-not-found-page">
    <nav class={["navbar", "trmrk-navbar-large", appLayout.isDarkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"].join(" ")}>
      <a class="trmrk-icon-link" href={appLayout.homePageUrl}>
        <BsIconBtn iconCssClass='bi bi-house' />
      </a>
    </nav>
    <div class="container trmrk-container">
      <Caption headerCssClass="trmrk-h2" caption="404" />
      <UIMessage message="Not Found" />
    </div>
  </div>);
}

export default NotFoundPage;
