import { Component } from 'solid-js';

import AppErrorPage from "./AppErrorPage";

const NotFoundPage: Component = () => {
  return (<AppErrorPage errTitle="404" errMessage="Not Found" />);
}

export default NotFoundPage;
