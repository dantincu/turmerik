import { inject, Type } from '@angular/core';
import { Routes, Route, Router } from '@angular/router';

import { NullOrUndef, withVal, jsonBool } from '../../../trmrk/core';
import { toNumMap } from '../../../trmrk/map';
import { mapPropNamesToThemselves, PropNameWordsConvention } from '../../../trmrk/propNames';

import { injectionTokens } from '../../services/dependency-injection/injection-tokens';
import { TrmrkAppSettings } from './trmrk-app-settings/trmrk-app-settings';
import { TrmrkAppThemes } from './trmrk-app-themes/trmrk-app-themes';
import { NotFound } from './trmrk-not-found/trmrk-not-found';
import { TrmrkResetApp } from './trmrk-reset-app/trmrk-reset-app';
import { commonQueryKeys } from '../../services/common/url';

export interface CommonRouteOpts extends Route {
  exclude?: boolean | NullOrUndef;
}

export interface GetCommonRoutesOpts {
  basePath?: string | NullOrUndef;
  routesMap?: { [key: number]: CommonRouteOpts } | NullOrUndef;
}

export enum CommonRoutes {
  NotFound = 0,
  App,
  Setup,
  Settings,
  Themes,
  ResetApp,
  Reset,
  UserProfile,
  ManageApp,
  Help,
}

export const defaultMainCommonRouteKeys = Object.freeze(
  mapPropNamesToThemselves(
    {
      App: '',
      Setup: '',
    },
    PropNameWordsConvention.KebabCase,
    PropNameWordsConvention.CamelCase
  )
);

export const defaultMainCommonChildRouteKeys = Object.freeze(
  mapPropNamesToThemselves(
    {
      Settings: '',
      Themes: '',
      ResetApp: '',
      Reset: '',
    },
    PropNameWordsConvention.KebabCase,
    PropNameWordsConvention.CamelCase
  )
);

export const defaultCommonChildRouteKeys = Object.freeze(
  mapPropNamesToThemselves(
    {
      UserProfile: '',
      ManageApp: '',
      Help: '',
    },
    PropNameWordsConvention.KebabCase,
    PropNameWordsConvention.CamelCase
  )
);

const getDefaultMainCommonChildRoutes = () =>
  withVal(
    toNumMap<CommonRouteOpts>(
      Object.keys(defaultMainCommonChildRouteKeys).map((key) =>
        withVal(CommonRoutes[key as keyof typeof CommonRoutes], (numKey) => ({
          key: numKey,
          value: {
            path: defaultMainCommonChildRouteKeys[
              key as keyof typeof defaultMainCommonChildRouteKeys
            ],
          } as CommonRouteOpts,
        }))
      )
    ) as {
      [key: number]: CommonRouteOpts;
    },
    (dfRoutes) => {
      dfRoutes[CommonRoutes.Settings].component = TrmrkAppSettings;

      withVal(dfRoutes[CommonRoutes.Themes], (route) => {
        route.component = TrmrkAppThemes;
        route.exclude = true;
      });

      dfRoutes[CommonRoutes.ResetApp].component = TrmrkResetApp;

      dfRoutes[CommonRoutes.Reset].redirectTo = () => {
        const router = inject(Router);
        const appConfig = inject(injectionTokens.appConfig.token);

        return router.createUrlTree(
          [[appConfig.value.routeBasePath, defaultMainCommonChildRouteKeys.ResetApp].join('/')],
          {
            queryParams: { [commonQueryKeys.reset]: jsonBool.true },
          }
        );
      };

      return dfRoutes;
    }
  );

const getDefaultMainCommonRoutes = () =>
  withVal({} as { [key: number]: Route }, (dfRoutes) => {
    dfRoutes[CommonRoutes.NotFound] = {
      path: '**',
      component: NotFound,
    };

    return dfRoutes;
  });

const getRoute = (opts: CommonRouteOpts | NullOrUndef, dfRoute: Route) => {
  let route: CommonRouteOpts | null;

  if (opts) {
    route = { ...opts };

    for (let key of Object.keys(dfRoute)) {
      (route as any)[key] ??= (dfRoute as any)[key];
    }
  } else {
    route = dfRoute;
  }

  if (route.exclude) {
    route = null;
  }

  delete route?.exclude;
  return route as Route;
};

const getRoutesArr = (
  routesMap: { [key: number]: CommonRouteOpts },
  dfRoutes: { [key: number]: Route }
) => {
  const routes: Routes = [];

  for (let key of Object.keys(dfRoutes)) {
    const route = getRoute(
      (routesMap as any)[key] as CommonRouteOpts | NullOrUndef,
      (dfRoutes as any)[key] as Route
    );

    if (route) {
      routes.push(route);
    }
  }

  return routes;
};

export const getAppRoutes = (appRoutes: Routes, opts?: GetCommonRoutesOpts | NullOrUndef) => {
  opts ??= {};
  opts.basePath ??= defaultMainCommonRouteKeys.App;
  opts.routesMap ??= {};

  const routes: Routes = [
    {
      path: opts.basePath,
      children: [...getRoutesArr(opts.routesMap, getDefaultMainCommonChildRoutes()), ...appRoutes],
    },
    ...getRoutesArr(opts.routesMap, getDefaultMainCommonRoutes()),
  ];

  return routes;
};
