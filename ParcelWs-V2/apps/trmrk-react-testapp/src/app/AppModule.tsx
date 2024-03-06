import React from "react";

export interface AppModuleProps {
  className: string,
  headerClassName: string,
  headerContent: React.ReactNode | Iterable<React.ReactNode>,
  mainClassName?: string | null | undefined;
  mainContent: React.ReactNode | Iterable<React.ReactNode>;
  afterHeaderClassName?: string | null | undefined;
  afterHeaderContent?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
}

export default function AppModule(props: AppModuleProps) {
  return (<div className={props.className}>
    <div className={props.headerClassName}>{props.headerContent}</div>
    { (props.afterHeaderClassName && props.afterHeaderContent) ? 
      <div className={props.afterHeaderClassName}>{props.afterHeaderContent}</div> : null }
    <main className={props.mainClassName ?? ""}>{props.mainContent}</main>
  </div>);
}
