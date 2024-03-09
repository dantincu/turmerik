import React from "react";

export interface IndexedDbBrowserProps {
  className?: string | null | undefined;
}

export default function IndexedDbBrowser(
  props: IndexedDbBrowserProps) {
  return (<div className={["trmrk-indexeddb-browser" , props.className ?? ""].join(" ")}>
    IndexedDBBrowser
  </div>);
}
