import { Component, Show, createMemo } from "solid-js";

import AppOptionsPopoverContent from "./AppOptionsPopoverContent";

const AppHiddenContent: Component = () => {
  return (<>
    <AppOptionsPopoverContent />
  </>)
};

export default AppHiddenContent;
