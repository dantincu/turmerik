import { Component, type JSX } from 'solid-js';

import Caption from "../common/Caption";
import UIMessage from "../common/UIMessage";

import BsIconBtn from "../BsBtn/BsIconBtn";

import { useAppContext } from "../../dataStore/core";

export interface ErrorProps {
  errTitle?: string | null | undefined;
  errMessage?: string | null | undefined;
  cssClass?: string | null | undefined;
  navBarChildren?: JSX.Element | JSX.Element[] | null | undefined;
}

const ErrorPage: Component<ErrorProps> = (props: ErrorProps) => {
  const { appData } = useAppContext();
  const appLayout = appData.appLayout;

  return (<div class="trmrk-error-page">
    <nav class={["navbar", "trmrk-navbar-large", props.cssClass ?? "", appLayout.isDarkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"].join(" ")}>
      <a class="trmrk-icon-link" href={appLayout.homePageUrl}>
        <BsIconBtn iconCssClass='bi bi-house' />
      </a>
      {props.navBarChildren}
    </nav>
    <div class="container trmrk-container">
      <Caption headerCssClass="trmrk-h2" caption={props.errTitle ?? ""} />
      <UIMessage message={props.errMessage ?? ""} />
    </div>
  </div>);
}

export default ErrorPage;
