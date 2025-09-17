import { inject, Type } from '@angular/core';
import { Routes, Route, Router } from '@angular/router';

import { NullOrUndef, withVal } from '../../../trmrk/core';

import { AppConfigServiceBase } from '../../services/common/app-config-service-base';

import { TrmrkAppSettings } from './trmrk-app-settings/trmrk-app-settings';
import { TrmrkAppThemes } from './trmrk-app-themes/trmrk-app-themes';
import { NotFound } from './trmrk-not-found/trmrk-not-found';
import { TrmrkResetApp } from './trmrk-reset-app/trmrk-reset-app';

export interface CommonRouteOpts extends Route {
  exclude?: boolean | NullOrUndef;
}

export interface GetCommonRoutesOpts {
  basePath?: string | NullOrUndef;
  routesMap?: { [key: number]: CommonRouteOpts } | NullOrUndef;
}

export enum CommonRoutes {
  NotFound = 0,
  Settings,
  Themes,
  ResetApp,
  Reset,
}

const defaultCommonChildRoutes = () =>
  withVal({} as { [key: number]: Route }, (dfRoutes) => {
    dfRoutes[CommonRoutes.Settings] = {
      path: 'settings',
      component: TrmrkAppSettings,
    };

    dfRoutes[CommonRoutes.Themes] = {
      path: 'themes',
      component: TrmrkAppThemes,
    };

    dfRoutes[CommonRoutes.ResetApp] = {
      path: 'reset-app',
      component: TrmrkResetApp,
    };

    dfRoutes[CommonRoutes.Reset] = {
      path: 'reset',
      redirectTo: () => {
        const router = inject(Router);
        const appConfigService = inject(AppConfigServiceBase);

        return router.createUrlTree([`${appConfigService.routeBasePath}/reset-app`], {
          queryParams: { reset: 'true' },
        });
      },
    };

    return dfRoutes;
  });

const defaultCommonRoutes = () =>
  withVal({} as { [key: number]: Route }, (dfRoutes) => {
    dfRoutes[CommonRoutes.Settings] = {
      path: '**',
      component: NotFound,
    };

    return dfRoutes;
  });

const getRoute = (opts: CommonRouteOpts | NullOrUndef, dfRoute: Route) => {
  let route: Route | null;

  if (opts) {
    if (!opts.exclude) {
      route = { ...opts };
      delete (route as CommonRouteOpts).exclude;

      for (let key of Object.keys(dfRoute)) {
        (route as any)[key] ??= (dfRoute as any)[key];
      }
    } else {
      route = null;
    }
  } else {
    route = dfRoute;
  }

  return route;
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
  opts.basePath ??= 'app';
  opts.routesMap ??= {};

  const routes: Routes = [
    {
      path: opts.basePath,
      children: [...getRoutesArr(opts.routesMap, defaultCommonChildRoutes()), ...appRoutes],
    },
    ...getRoutesArr(opts.routesMap, defaultCommonRoutes()),
  ];

  return routes;
};
