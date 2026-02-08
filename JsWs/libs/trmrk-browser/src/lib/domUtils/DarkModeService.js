import { getTrmrk } from "../../trmrk/TRMRK-GLOBAL-OBJECT/trmrk-global-object-core";
export const prefersDarkMode = () => window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
export const isDarkMode = (localStorageIsDarkModeKey) => {
    const localStorageIsDarkMode = localStorage.getItem(localStorageIsDarkModeKey);
    let isDarkMode;
    if (localStorageIsDarkMode) {
        if ("true" === localStorageIsDarkMode) {
            isDarkMode = true;
        }
        else if ("false" === localStorageIsDarkMode) {
            isDarkMode = false;
        }
        else {
            isDarkMode = prefersDarkMode();
        }
    }
    else {
        isDarkMode = prefersDarkMode();
    }
    return isDarkMode;
};
export class DarkModeService {
    stateChangeHandler;
    onDarkModeStateChanged;
    dbObjNamePrefix;
    appThemeIsDarkModeLocalStorageKey;
    _disposeCalled = false;
    constructor() {
        this.storageEvent = this.storageEvent.bind(this);
    }
    init(args) {
        args ??= {
            addStorageEventListener: false,
        };
        this.dbObjNamePrefix = getTrmrk().dbObjNamePrefix;
        this.appThemeIsDarkModeLocalStorageKey =
            args.localStorageKey ?? `${this.dbObjNamePrefix}[appThemeIsDarkMode]`;
        this.stateChangeHandler =
            args.stateChangeHandler ??
                ((isDarkModeValue) => {
                    document.documentElement.setAttribute("data-theme", isDarkModeValue ? "dark" : "light");
                });
        this.onDarkModeStateChanged = args.onStateChanged ??= () => { };
        if (args.addStorageEventListener !== false) {
            window.addEventListener("storage", this.storageEvent);
        }
        this.detectDarkMode();
    }
    storageEvent(event) {
        if ((event.key ?? null) === null ||
            event.key === this.appThemeIsDarkModeLocalStorageKey) {
            let isDarkModeValue = false;
            if ((event.key ?? null) === null ||
                (event.key === this.appThemeIsDarkModeLocalStorageKey &&
                    (event.newValue ?? null) === null)) {
                isDarkModeValue = isDarkMode(this.appThemeIsDarkModeLocalStorageKey);
            }
            else {
                isDarkModeValue = event.newValue === "true";
            }
            this.updateDarkMode(isDarkModeValue);
        }
    }
    updateDarkMode(isDarkModeValue) {
        this.stateChangeHandler(isDarkModeValue);
        this.onDarkModeStateChanged(isDarkModeValue);
    }
    detectDarkMode() {
        const isDarkModeValue = isDarkMode(this.appThemeIsDarkModeLocalStorageKey);
        this.updateDarkMode(isDarkModeValue);
    }
    dispose() {
        if (!this._disposeCalled) {
            this._disposeCalled = true;
            this.stateChangeHandler = null;
            this.onDarkModeStateChanged = null;
            window.removeEventListener("storage", this.storageEvent);
        }
    }
    [Symbol.dispose]() {
        this.dispose();
    }
}
