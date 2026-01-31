import React, { AnchorHTMLAttributes, ReactNode, forwardRef } from "react";
import Link, { LinkProps } from "next/link";

import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkLink.scss";

export type TrmrkLinkProps = LinkProps & 
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: ReactNode;
    useTrmrkContextMenu?: boolean | NullOrUndef;
    isHyperLink?: boolean | NullOrUndef;
  };

const TrmrkLink = forwardRef<HTMLAnchorElement, TrmrkLinkProps>(({
  className,
  children,
  useTrmrkContextMenu,
  isHyperLink,
  ...props
}: Readonly<TrmrkLinkProps>, ref) => {
  return <Link ref={ref} {...props} className={["trmrk-link", (isHyperLink ?? true) ? "trmrk-hyper-link" : "", className ?? ""].join(" ")}>{children}</Link>
});

export default TrmrkLink;
