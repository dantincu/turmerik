import { mapPropNamesToThemselves, PropNameWordsConvention } from '../../../trmrk/propNames';

export const APP_NAME = 'trmrk-filemanager-ngapp';

export const appRouteKeys = Object.freeze(
  mapPropNamesToThemselves(
    {
      Folder: '',
    },
    PropNameWordsConvention.KebabCase,
    PropNameWordsConvention.CamelCase
  )
);
