'use client';

import React from "react";
import { useAtom } from "jotai";

import TrmrkLoader from "../TrmrkLoader/TrmrkLoader";

import { appInitializerAtoms } from "./TrmrkAppInitializerService";

export default function TrmrkAppInitializer({
  children,
  initialize
}: Readonly<{
  children: React.ReactNode;
  initialize: () => Promise<void>
}>) {
  const [, setInitStarted] = useAtom(appInitializerAtoms.initStarted);
  const [, setInitEnded] = useAtom(appInitializerAtoms.initEnded);
  const [initIsOk, setInitIsOk] = useAtom(appInitializerAtoms.initIsOk);

  React.useEffect(() => {
    setInitStarted(true);

    initialize().then(() => {
      setInitEnded(true);
      setInitIsOk(true);
    });
  }, []);

  return initIsOk ? children : <TrmrkLoader></TrmrkLoader>;
}
