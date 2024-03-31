/** @jsxImportSource @emotion/react */
import React, { useEffect, useState, useRef, ErrorInfo } from "react";

import { withErrorBoundary, useErrorBoundary } from "react-use-error-boundary";

import DummyComponent from "trmrk-temp-react/src/DummyComponent";

const App = withErrorBoundary(() => {
  const [error, resetError] = useErrorBoundary(
    // You can optionally log the error to an error reporting service
    // (error, errorInfo) => logErrorToMyService(error, errorInfo)
  );

  useEffect(() => {
  });

  if (error) {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre className="trmrk-error">{((error as Error).message ?? error).toString()}</pre>
        <button onClick={resetError}>Try again</button>
      </div>
    );
  }

  return (<div className={["trmrk-app"].join(" ")} css={{
    backgroundColor: "yellow"
  }}>
      <DummyComponent />
    </div>);
});
  
export default App;
