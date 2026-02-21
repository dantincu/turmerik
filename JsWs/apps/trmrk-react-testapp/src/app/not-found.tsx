'use client';

import React from 'react';
import { useAtom } from 'jotai';

import TrmrkAppBarContents from "@/src/trmrk-react/components/TrmrkAppBarContents/TrmrkAppBarContents";
import TrmrkTopToolBarContents from "@/src/trmrk-react/components/TrmrkTopToolBarContents/TrmrkTopToolBarContents";

import {
  trmrk3PanelsAppLayoutAtoms,
  init3PanelsAppLayout,
  cleanup3PanelsAppLayout,
  use3PanelsAppLayoutAtoms
} from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";

const AppBar = () => {
  return <TrmrkAppBarContents><h1 className="text-center grow">404</h1></TrmrkAppBarContents>;
}

const TopToolbar = () => {
  return <TrmrkTopToolBarContents></TrmrkTopToolBarContents>;
}

export default function NotFound() {
  const trmrk3PanelsLayoutAtoms = use3PanelsAppLayoutAtoms();
  const [, setFocusedPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);

  React.useEffect(() => {
    const layoutInitResult = init3PanelsAppLayout({
      ...trmrk3PanelsLayoutAtoms,
      appBar: {
        contents: <AppBar />,
      },
      topToolbar: {
        contents: <TopToolbar />,
      },
      middlePanel: {
        contents: <div className="flex flex-col items-center justify-center py-2">
            <h2>Not found</h2>
            <p className="text-zinc-500 mt-2">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>
      },
      setFocusedPanel
    });

    return () => {
      cleanup3PanelsAppLayout(layoutInitResult);
    }
  }, []);

  return null;
}
