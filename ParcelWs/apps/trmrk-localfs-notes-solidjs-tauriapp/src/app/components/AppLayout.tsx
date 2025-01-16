import { ParentComponent } from 'solid-js';

import AppLayoutCore from "../../trmrk-solidjs/components/AppLayout/AppLayout";
import AppHiddenContent from "../../trmrk-solidjs/components/AppLayout/AppHiddenContent";

import { setAppHiddenContent } from "../../trmrk-solidjs/signals/core";

const AppLayout: ParentComponent = (props) => {
  setAppHiddenContent(<AppHiddenContent />);
  return <AppLayoutCore>{props.children}</AppLayoutCore>;
}

export default AppLayout;
