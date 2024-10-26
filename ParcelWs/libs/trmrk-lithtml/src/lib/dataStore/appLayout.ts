import { ObservableValueSingletonControllerFactory } from "../controlers/ObservableValueController";

/* APP LAYOUT DOM ELEMENT
 */

/** Gets or sets the ***app layout root dom element*** */
export const appLayoutRootDomElemPropFactory =
  new ObservableValueSingletonControllerFactory<HTMLDivElement | null>(
    null,
    null
  );

/* APP LAYOUT CSS CLASS
 */

/** Gets or sets the ***app layout css class*** */
export const appLayoutCssClassPropFactory =
  new ObservableValueSingletonControllerFactory<string | null>(null, null);

/* DOC TITLE
 */

/** Gets or sets the ***html doc title*** */
export const docTitlePropFactory =
  new ObservableValueSingletonControllerFactory<string | null>(null, null);

/* DEFAULT DOC TITLE
 */

/** Gets or sets the ***default html doc title*** */
export const defaultDocTitlePropFactory =
  new ObservableValueSingletonControllerFactory<string | null>(null, null);

/* APP TITLE
 */

/** Gets or sets the ***app title*** */
export const appTitlePropFactory =
  new ObservableValueSingletonControllerFactory<string | null>(null, null);

/* DEFAULT APP TITLE
 */

/** Gets or sets the ***default app title*** */
export const defaultAppTitlePropFactory =
  new ObservableValueSingletonControllerFactory<string | null>(null, null);
