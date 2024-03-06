import React from "react";

export default function AppBarCore({
    children,
    elemRef,
    className,
    style,
    height
  }: {
    children: React.ReactNode
    elemRef: React.RefObject<HTMLDivElement>,
    className: string,
    style?: Object | null | undefined,
    height?: string | null | undefined
  }) {
  return (<div className={className}>
      { children }
  </div>);
}
