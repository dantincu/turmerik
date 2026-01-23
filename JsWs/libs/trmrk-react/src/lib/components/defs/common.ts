import { NullOrUndef } from "@/src/trmrk/core";

export interface ComponentProps {
  cssClass?: string | NullOrUndef;
  children?: React.ReactNode | NullOrUndef;
}

export interface ComponentsMap {
  map: { [key: string]: () => React.ReactNode };
}
