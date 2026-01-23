'use client';

import TrmrkAppInitializer from "@/src/trmrk-react/components/TrmrkAppInitializer/TrmrkAppInitializer";

export default function AppInitializer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TrmrkAppInitializer initialize={() => new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100)
  })}>{children}</TrmrkAppInitializer>  
}
