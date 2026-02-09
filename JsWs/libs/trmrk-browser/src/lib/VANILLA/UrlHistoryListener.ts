import { RefLazyValue, NullOrUndef } from "../../trmrk/core";
import { TrmrkDisposableBase } from "../../trmrk/TrmrkDisposableBase";

export interface UrlHistoryPushStateArgs {
  url: string | URL;
  state: any;
  title: string;
}

export interface UrlRouterArgs {
  onPopState?: ((ev: PopStateEvent) => void) | NullOrUndef;
  onStateChange?:
    | ((ev: PopStateEvent | UrlHistoryPushStateArgs) => void)
    | NullOrUndef;
}

export class UrlRouter extends TrmrkDisposableBase {
  args: UrlRouterArgs;

  constructor(args: UrlRouterArgs) {
    super();
    this.args = this.normalizeArgs(args);
    this.onPopState = this.onPopState.bind(this);
    window.addEventListener("popstate", this.onPopState);
  }

  disposeCore() {
    window.removeEventListener("popstate", this.onPopState);
    this.args = null!;
  }

  normalizeArgs(args: UrlRouterArgs) {
    args = { ...args };
    args.onPopState ??= () => {};
    args.onStateChange ??= () => {};
    return args;
  }

  pushState(url: string | URL, state: any, title: string) {
    window.history.pushState(state, title, url);

    this.args.onStateChange!({
      url,
      state,
      title,
    });
  }

  private onPopState(ev: PopStateEvent) {
    this.args.onPopState!(ev);
  }
}

export class UrlRouterFactory {
  create(args: UrlRouterArgs) {
    return new UrlRouter(args);
  }
}

export const defaultUrlRouterFactory = new RefLazyValue(
  () => new UrlRouterFactory(),
);
