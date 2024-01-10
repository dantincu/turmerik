import React from "react";

import styled from "@emotion/styled";

export default function CharIcon({
    children,
    className,
    css,
    fontSize,
    lineHeight,
    marginTop,
  }: {
    children: React.ReactNode,
    className?: string | null | undefined,
    css?: string | null | undefined,
    fontSize?: string | null | undefined,
    lineHeight?: string | null | undefined,
    marginTop?: string | null | undefined
  }) {
  css ??= `
    font-size: ${fontSize};
    line-height: ${lineHeight};
    margin-top: ${marginTop};
  `;

  const cssClass = className ?? "";
  const InnerEl = ({ className }: { className?: string }) => <span className={[cssClass, className ?? ""].join(" ")}>{ children }</span>

  const CharIconEl = styled(InnerEl)(css);
  return (<CharIconEl />);
}
