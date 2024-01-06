import React from "react";

import styled from "@emotion/styled";

export default function CharIcon({
    children,
    css,
    fontSize,
    lineHeight,
    marginTop,
  }: {
    children: React.ReactNode,
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

  const CharIconEl = styled.span(css);
  return (<CharIconEl>{ children }</CharIconEl>);
}
