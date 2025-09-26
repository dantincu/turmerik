import { mapPropNamesToThemselves, PropNameWordsConvention } from '../../../trmrk/propNames';

export const urlQueryKeys = mapPropNamesToThemselves(
  {
    tabId: '',
    sessionUuid: '',
    csPfKey: '',
    csUserIdnf: '',
  },
  PropNameWordsConvention.KebabCase,
  PropNameWordsConvention.CamelCase
);
