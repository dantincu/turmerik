'use client';

import { useAtom } from "jotai";

import TrmrkAppInitializer from "@/src/trmrk-react/components/TrmrkAppInitializer/TrmrkAppInitializer";
import { trmrk3PanelsAppLayoutAtoms } from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";

export default function AppInitializer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [ _, setIsMultiPanelMode ] = useAtom(trmrk3PanelsAppLayoutAtoms.isMultiPanelMode)

  return <TrmrkAppInitializer initialize={() => new Promise<void>((resolve) => {
    setIsMultiPanelMode(false);

    setTimeout(() => {
      resolve();
    }, 100)
  })}>{children}</TrmrkAppInitializer>  
}
