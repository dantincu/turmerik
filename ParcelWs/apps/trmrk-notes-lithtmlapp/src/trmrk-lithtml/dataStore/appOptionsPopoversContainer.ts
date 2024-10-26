import { ObservableValueSingletonControllerFactory } from "../controlers/ObservableValueController";

/* APP LAYOUT POPOVERS CONTAINER DOM ELEMENT
 */

/** Gets or sets the ***app layout popovers container dom element*** */
export const appLayoutPopoversContainerDomElemPropFactory =
  new ObservableValueSingletonControllerFactory<HTMLDivElement | null>(
    null,
    null
  );

export interface GetOrAddAppLayoutPopoverOpts<
  THTMLElement extends HTMLElement
> {
  appLayoutPopoversContainerDomElem: HTMLDivElement;
  cssSelector?: string | null | undefined;
  selector?: (popoversContainerDomElem: HTMLDivElement) => THTMLElement;
  popoverFactory: (popoversContainerDomElem: HTMLDivElement) => THTMLElement;
  addPopoverToContainer?: boolean | null | undefined;
}

export const getOrAddAppLayoutPopover = <THTMLElement extends HTMLElement>(
  opts: GetOrAddAppLayoutPopoverOpts<THTMLElement>
) => {
  const selector =
    opts.selector ??
    ((popoversContainerDomElem) =>
      popoversContainerDomElem.querySelector(opts.cssSelector!));

  let popoverElem = selector(opts.appLayoutPopoversContainerDomElem);

  if (!popoverElem) {
    popoverElem = opts.popoverFactory(opts.appLayoutPopoversContainerDomElem);

    if ((opts.addPopoverToContainer ?? false) !== false) {
      opts.appLayoutPopoversContainerDomElem.appendChild(popoverElem);
    }
  }
};

export const removeAppLayoutPopover = <THTMLElement extends HTMLElement>(
  appLayoutPopoversContainerDomElem: HTMLDivElement,
  popoverElem: THTMLElement | string
) => {
  if (typeof popoverElem !== "object") {
    popoverElem = appLayoutPopoversContainerDomElem.querySelector(
      popoverElem
    ) as THTMLElement;
  }

  appLayoutPopoversContainerDomElem.removeChild(popoverElem);
};

/* APP LAYOUT OPTIONS POPOVER DOM ELEMENT
 */

/** Gets or sets the ***app layout options popover element tag name*** */
export const appLayoutOptionsPopoverDomElemTagNamePropFactory =
  new ObservableValueSingletonControllerFactory<string | null>(
    null,
    "trmrk-app-options-popover-content"
  );
