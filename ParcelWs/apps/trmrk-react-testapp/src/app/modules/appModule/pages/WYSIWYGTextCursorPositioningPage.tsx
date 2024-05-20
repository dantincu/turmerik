import React from "react";

import AppBarsPanel from "../../../../trmrk-react/components/barsPanel/AppBarsPanel";
import { appBarSelectors, appBarReducers } from "../../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../../store/appDataSlice";

import { positionTextCaret, getTextCaretPositionerOpts } from "../../../../trmrk-browser/textCaretPositioner/textCaretPositioner";
import { CaretCharJustify } from "../../../../trmrk-browser/textCaretPositioner/textCaretPositionerCore";

export interface WYSIWYGTextCursorPositioningProps {
  urlPath: string
  basePath: string;
  rootPath: string;
}

export default function WYSIWYGTextCursorPositioningPage(
  props: WYSIWYGTextCursorPositioningProps
) {
  const [ textCaretEl, setTextCaretEl ] = React.useState<HTMLSpanElement | null>(null);
  const [ invisibleTextCaretEl, setInvisibleTextCaretEl ] = React.useState<HTMLSpanElement | null>(null);
  const [ positioningTextEl, setPositioningTextEl ] = React.useState<HTMLDivElement | null>(null);

  const positioningTextElemClicked = React.useCallback((ev: MouseEvent) => {
    const trgEl = ev.target;

    if (trgEl !== invisibleTextCaretEl && trgEl !== textCaretEl && trgEl instanceof HTMLElement) {
      
      const opts = getTextCaretPositionerOpts(positioningTextEl!, trgEl, textCaretEl!, invisibleTextCaretEl!, ev, CaretCharJustify.Left);
      positionTextCaret(opts);
    }
  }, [ positioningTextEl, invisibleTextCaretEl, textCaretEl ]);

  React.useEffect(() => {
    const positioningTextElClick = (ev: MouseEvent) => {
      positioningTextElemClicked(ev);
    }

    if (positioningTextEl) {
      positioningTextEl.addEventListener("click", positioningTextElClick, {
        capture: true
      });
    }

    return () => {
      if (positioningTextEl) {
        positioningTextEl.removeEventListener("click", positioningTextElClick, {
          capture: true
        });
      }
    };
  }, [
    positioningTextEl ]);

  return (<AppBarsPanel basePath={props.basePath}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}>
    <div className="trmrk-block trmrk-horiz-padded" ref={el => setPositioningTextEl(el)}>
      <span className="trmrk-invisible-text-caret" ref={el => setInvisibleTextCaretEl(el)}></span>
      <span className="trmrk-text-caret" ref={el => setTextCaretEl(el)}></span>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
    </div>
  </AppBarsPanel>);
}
