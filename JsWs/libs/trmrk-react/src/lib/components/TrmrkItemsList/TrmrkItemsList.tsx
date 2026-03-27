import React from "react";

import "./TrmrkItemsList.scss";
import { NullOrUndef } from "@/src/trmrk/core";

export interface TrmrkItemsListProps extends React.ComponentPropsWithRef<'div'> {
  tagName?: React.ElementType | NullOrUndef;
  itemsAreOutlined?: boolean | NullOrUndef;
}

const TrmrkItemsList = React.forwardRef(({children, className, tagName, itemsAreOutlined, ...props}: TrmrkItemsListProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const List = tagName ?? 'div';
  
  return <List className={[
        "trmrk-items-list",
        itemsAreOutlined ? "trmrk-items-are-outlined" : "",
        className ?? ""]} {...props} ref={ref as React.RefObject<HTMLDivElement>}>
    {children}
    </List>
});

export default TrmrkItemsList;
export const TrmrkItemsListMM = React.memo(TrmrkItemsList);
