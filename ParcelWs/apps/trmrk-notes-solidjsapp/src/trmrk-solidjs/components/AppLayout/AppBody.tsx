import { ParentComponent } from "solid-js";

import { useAppContext } from "../../dataStore/core";
import AppExplorerPanel from "./AppExplorerPanel";
import { setAppBodyEl } from "../../signals/core";

export interface AppBodyProps {

}

const AppBody: ParentComponent<AppBodyProps> = (props) => {
  const { appData } = useAppContext();

  const appLayout = appData.appLayout;
  const appHeader = appLayout.appHeader;
  const appFooter = appLayout.appFooter;
  const explorerPanel = appLayout.explorerPanel;

  return (<main class={["trmrk-app-body",
    appHeader.show ? "trmrk-after-header" : "",
    appFooter.show ? "trmrk-before-footer" : "",
    (explorerPanel.isEnabled && !appLayout.isCompactMode) ? "trmrk-is-split" : ""].join(" ")}
    ref={setAppBodyEl}>
      { appLayout.isCompactMode ? (explorerPanel.isEnabled && explorerPanel.isFocused) ? <AppExplorerPanel /> : props.children : <>
        { explorerPanel.isEnabled ? <AppExplorerPanel /> : null }
        {props.children}
      </> }
    </main>);
}

export default AppBody;
