import React from "react";

import ErrorEl from "../error/ErrorEl";

const NotFound = () => {
  return (<ErrorEl errCaption="404" errMessage="Page not found"></ErrorEl>);
}

export default NotFound;
