import React from "react";

import './styles.scss';

const Error = ({
    errCaption,
    errMessage
  }: {
    errCaption?: string | null | undefined
    errMessage: string
  }) => {
  return (<div className="trmrk-error">
      <h1>{errCaption}</h1>
      <h2>{errMessage}</h2>
    </div>);
}

export default Error;
