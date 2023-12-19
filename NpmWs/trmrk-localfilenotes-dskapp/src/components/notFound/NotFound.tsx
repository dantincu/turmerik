import React from "react";

import Error from "../error/Error";

const NotFound = () => {
  return (<Error errCaption="404" errMessage="Page not found"></Error>);
}

export default NotFound;
