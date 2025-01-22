import { Component } from 'solid-js';
import { produce } from "solid-js/store";

import { useAppContext } from "../../dataStore/AppContext";
import BsIconBtn from "../../../trmrk-solidjs/components/BsBtn/BsIconBtn";
import { setDomBsAppTheme } from "../../../trmrk-solidjs/domUtils/core";

const SettingsPage: Component = () => {
  const { appData, setAppDataFull, setAppData } = useAppContext();
  const appLayout = appData.appLayout;

  const appModeChanged = (e: Event) => {
    const isCompactModeNewVal = !appLayout.isCompactMode;

    setAppDataFull(produce(draft => {
      draft.appLayout.isCompactMode = isCompactModeNewVal;
    }));
  }

  const appThemeChanged = (e: MouseEvent | TouchEvent) => {
    const isDarkModeNewVal = !appLayout.isDarkMode;

    setAppDataFull(produce(draft => {
      draft.appLayout.isDarkMode = isDarkModeNewVal;
    }));

    setDomBsAppTheme(isDarkModeNewVal);
  }

  return (<div class="container">
    <div class="mb-3">
      <label class="trmrk-form-check-label form-check-label">
        <input type="checkbox" class="form-check-input trmrk-form-check-input" {...(appLayout.isCompactMode ? { checked: true } : { })} onChange={appModeChanged} />
        <span class="trmrk-label">Compact Mode</span></label>
    </div>
    <div class="mb-3">
      <label class="form-label trmrk-form-label">
        <BsIconBtn iconCssClass={ appLayout.isDarkMode ? "bi bi-moon" : "bi bi-sun" } onClick={appThemeChanged} />
        <span class="trmrk-label">{ appLayout.isDarkMode ? "Dark Mode" : "Light Mode" }</span></label>
    </div>
  </div>);
};

export default SettingsPage;
