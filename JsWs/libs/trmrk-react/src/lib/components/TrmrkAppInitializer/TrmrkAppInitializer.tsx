'use client';

import React from "react";
import { useAtom } from "jotai";

import { NullOrUndef, actWithValIf } from "@/src/trmrk/core";

import TrmrkLoader from "../TrmrkLoader/TrmrkLoader";
import { appInitializerAtoms } from "./TrmrkAppInitializerService";

export default function TrmrkAppInitializer({
  children,
  initialize,
  appInitialLoaderElId = "trmrk-app-initial-loader"
}: Readonly<{
  children: React.ReactNode;
  initialize: () => Promise<void>,
  appInitialLoaderElId?: string | NullOrUndef
}>) {
  const [, setInitStarted] = useAtom(appInitializerAtoms.initStarted);
  const [, setInitEnded] = useAtom(appInitializerAtoms.initEnded);
  const [initIsOk, setInitIsOk] = useAtom(appInitializerAtoms.initIsOk);

  React.useEffect(() => {
    actWithValIf(appInitialLoaderElId, id => {
      actWithValIf(document.getElementById(id), el => el.style.display = "none");
    }, null, id => (id ?? "") === "");

    setInitStarted(true);

    initialize().then(() => {
      setInitEnded(true);
      setInitIsOk(true);
    });
  }, []);

  return initIsOk ? children : <div
      className="flex flex-col h-full items-center justify-center">
    <div className="flex-row"><TrmrkLoader></TrmrkLoader></div>
  </div>;
}
