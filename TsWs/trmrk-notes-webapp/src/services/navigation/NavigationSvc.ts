export class NavigationSvc {
  private _beforeNavigate: () => void;

  constructor() {
    this._beforeNavigate = () => {};
  }

  public get beforeNavigate() {
    return this._beforeNavigate;
  }

  public set beforeNavigate(value: () => void) {
    this._beforeNavigate = value;
  }

  public navigate(navigateAction: () => void) {
    this._beforeNavigate();
    navigateAction();
  }
}

export const navSvc = new NavigationSvc();
