import React from "react";

const Error = ({
    errCaption,
    errMessage
  }: {
    errCaption?: string | null | undefined
    errMessage: string
  }) => {
  return (<div className="trmrk-app-error">
      <h1>{errCaption}</h1>
      <h2>{errMessage}</h2>
    </div>);
}

export default Error;
