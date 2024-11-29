import { Component } from 'solid-js';

import Caption from "../common/Caption";
import UIMessage from "../common/UIMessage";

export interface ErrorProps {
  errTitle?: string | null | undefined;
  errMessage?: string | null | undefined;
}

const Error: Component<ErrorProps> = (props: ErrorProps) => {
  return (<div class="trmrk-error-el">
    <Caption caption={props.errTitle ?? ""} />
    <UIMessage message={props.errMessage ?? ""} />
  </div>);
}

export default Error;
