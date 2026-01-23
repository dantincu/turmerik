'use client';

import React from "react";
import { useAtom } from "jotai";

import TrmrkLoader from "../TrmrkLoader/TrmrkLoader";

import { appInitializedAtom } from "./TrmrkAppInitializerService";

export default function TrmrkAppInitializer({
  children,
  initialize
}: Readonly<{
  children: React.ReactNode;
  initialize: () => Promise<void>
}>) {
  const [appInitialized, setAppInitializedAtom] = useAtom(appInitializedAtom);

  React.useEffect(() => {
    initialize().then(() => {
      setAppInitializedAtom(true);
    });
  });

  return appInitialized ? children : <TrmrkLoader></TrmrkLoader>;
}
