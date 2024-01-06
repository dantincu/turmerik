import React from "react";

import styled from "@emotion/styled";

const CloseIconElFactory = ({
    fontSize,
    lineHeight,
    marginTop
  }: {
    fontSize: string,
    lineHeight: string,
    marginTop: string
  }) => styled.span`
  font-size: ${fontSize};
  line-height: ${lineHeight};
  margin-top: ${marginTop};
`;

export default function CloseIcon({
    fontSize,
    lineHeight,
    marginTop
  }: {
    fontSize: string,
    lineHeight: string,
    marginTop: string
  }) {
  const CloseIconEl = CloseIconElFactory({
    fontSize, lineHeight, marginTop
  });

  return (<CloseIconEl>&times;</CloseIconEl>);
}
