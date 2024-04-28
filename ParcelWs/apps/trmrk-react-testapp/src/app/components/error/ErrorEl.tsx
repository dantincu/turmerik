import React from "react";

const ErrorEl = ({
    errCaption,
    errMessage
  }: {
    errCaption?: string | null | undefined
    errMessage: string
  }) => {
  return (<div className="trmrk-app-error">
      <h2>{errCaption}</h2>
      <p>{errMessage}</p>
    </div>);
}

export default ErrorEl;
