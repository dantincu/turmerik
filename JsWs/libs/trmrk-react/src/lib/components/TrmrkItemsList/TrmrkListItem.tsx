import React from "react";

import "./TrmrkItemsList.scss";
import { NullOrUndef } from "@/src/trmrk/core";

export interface TrmrkOutlinedItemsListProps extends React.ComponentPropsWithRef<'div'> {
  tagName?: React.ElementType | NullOrUndef;
}

const TrmrkOutlinedItemsList = React.forwardRef(({children, className, tagName, ...props}: TrmrkOutlinedItemsListProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const ListItem = tagName ?? 'div';
  
  return <ListItem className={[
        "trmrk-list-item",
        className ?? ""]} {...props} ref={ref as React.RefObject<HTMLDivElement>}>
    {children}
  </ListItem>
});

export default TrmrkOutlinedItemsList;
export const TrmrkOutlinedItemsListMM = React.memo(TrmrkOutlinedItemsList);
