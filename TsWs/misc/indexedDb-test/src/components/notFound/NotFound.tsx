import React from "react";

import ErrorEl from "../error/ErrorEl";

const NotFound = ({
    errCaption,
    errMessage
  }: {
    errCaption?: string | null | undefined
    errMessage?: string | null | undefined
  }) => {
  return (<ErrorEl errCaption={errCaption ?? "404"} errMessage={errMessage ?? "Page not found"}></ErrorEl>);
}

export default NotFound;
