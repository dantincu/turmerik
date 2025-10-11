import { mapPropNamesToThemselves, PropNameWordsConvention } from '../../../trmrk/propNames';

export const urlQueryKeys = mapPropNamesToThemselves(
  {
    tabId: '',
    sessionId: '',
    csPfKey: '',
    csUserIdnf: '',
  },
  PropNameWordsConvention.KebabCase,
  PropNameWordsConvention.CamelCase
);
