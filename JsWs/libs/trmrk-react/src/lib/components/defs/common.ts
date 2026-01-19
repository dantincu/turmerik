import { NullOrUndef } from "@/src/trmrk/core";

export interface CommponentProps<TRootElement = HTMLElement> {
  cssClass?: string | NullOrUndef;
  children?: React.ReactNode | NullOrUndef;
  rootElRef?: ((rootEl: TRootElement) => void) | NullOrUndef;
}

export interface ComponentsMap {
  map: { [key: string]: () => React.ReactNode };
}
