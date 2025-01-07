import { Component } from 'solid-js';

import ErrorPage from "./ErrorPage";

const NotFoundPage: Component = () => {
  return (<ErrorPage errTitle="404" errMessage="Not Found" />);
}

export default NotFoundPage;
