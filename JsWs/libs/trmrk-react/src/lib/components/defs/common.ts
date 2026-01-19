import { NullOrUndef } from "@/src/trmrk/core";

export interface CommponentProps {
  cssClass?: string | NullOrUndef;
  children?: React.ReactNode | NullOrUndef;
}

export interface ComponentsMap {
  map: { [key: string]: () => React.ReactNode };
}
