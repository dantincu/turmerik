import * as core from "./core";
import * as useRefState from "./useRefState";
import * as createFormState from "./createFormState";
import * as useRefLazyFormState from "./useRefLazyFormState";
import * as useRefLazyFormStatesList from "./useRefLazyFormStatesList";

export const forms = {
  ...core,
  ...useRefState,
  ...createFormState,
  ...useRefLazyFormState,
  ...useRefLazyFormStatesList,
};
