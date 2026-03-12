import React from "react";
import { PrimitiveAtom } from "jotai";

import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkListPager.scss";

export interface TrmrkListPagerFullProps {
  cssClass?: string | NullOrUndef;
  pageSize: number;
  itemsCount: PrimitiveAtom<number>;
  skipItems: PrimitiveAtom<number>;
}

export default function TrmrkListPagerFull({
  cssClass
}: TrmrkListPagerFullProps) {
  return <div className={["trmrk-list-pager-full-container", cssClass ?? ""].join(" ")}></div>;
}
