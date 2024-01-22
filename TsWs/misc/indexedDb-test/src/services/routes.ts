import trmrk from "trmrk";
import { Kvp } from "trmrk/src/core";

import { AppRouteInfo } from "./appData";

export const dbNameParam = "dbName";
export const dbStoreNameParam = "dbStoreName";
export const dbStoreRecordPkParam = "dbStoreRecordPk";

export const defaultHtmlDocTitleSuffix = "IndexedDb Test";
export const defaultPageNotFoundHtmlDocTitle = "Page Not Found";

const getRouteTemplate = (
  routeName: string,
  startsWithSlash?: boolean | null | undefined
) => (startsWithSlash ?? true ? `/${routeName}` : routeName);

const getDefaultAppTitle = (pathname: string) => {
  let defaultAppTitle = pathname.split("/").find((str) => str.length) ?? "";
  defaultAppTitle = trmrk.capitalizeFirstLetter(defaultAppTitle);

  return defaultAppTitle;
};

const getDefaultHtmlDocTitle = (
  pathname: string,
  defaultAppTitle?: string | null | undefined
) => {
  defaultAppTitle ??= getDefaultAppTitle(pathname);

  const defaultHtmlDocTitle = [defaultAppTitle, defaultHtmlDocTitleSuffix]
    .filter((str) => str)
    .join(" - ");

  return defaultHtmlDocTitle;
};

export interface GetRouteArgs {
  routeName: string;
  dbName?: string | null | undefined;
  dbStoreName?: string | null | undefined;
  dbStoreRecordPk?: string | null | undefined;
  startsWithSlash?: boolean | null | undefined;
}

export const getRoute = (
  routeName: string | GetRouteArgs,
  dbName: string | null = null,
  dbStoreName: string | null = null,
  dbStoreRecordPk: string | null = null,
  startsWithSlash: boolean = true
) => {
  let routeArgs: GetRouteArgs = routeName as GetRouteArgs;

  if (typeof routeArgs !== "object") {
    routeArgs = {
      routeName,
      dbName,
      dbStoreName,
      dbStoreRecordPk,
      startsWithSlash,
    } as GetRouteArgs;
  }

  let routeStr = getRouteTemplate(
    routeArgs.routeName,
    routeArgs.startsWithSlash
  );

  let queryParamsArr: Kvp<string, string>[] = [];

  if (routeArgs.dbName) {
    queryParamsArr.push({
      key: dbNameParam,
      value: routeArgs.dbName,
    });
  }

  if (routeArgs.dbStoreName) {
    queryParamsArr.push({
      key: dbStoreNameParam,
      value: routeArgs.dbStoreName,
    });
  }

  if (routeArgs.dbStoreRecordPk) {
    queryParamsArr.push({
      key: dbStoreRecordPkParam,
      value: routeArgs.dbStoreRecordPk,
    });
  }

  if (queryParamsArr.length > 0) {
    const queryStr = queryParamsArr
      .map((kvp) => [kvp.key, encodeURIComponent(kvp.value)].join("="))
      .join("&");

    routeStr = [routeStr, queryStr].join("?");
  }

  return routeStr;
};

const createRoutesObj = () => {
  const routesArr: AppRouteInfo[] = [];

  const addRoute = (routeObj: AppRouteInfo | { pathname: string } | string) => {
    if (typeof routeObj !== "object") {
      routeObj = { pathname: routeObj };
    }

    const appRouteInfo = routeObj as AppRouteInfo;
    appRouteInfo.appTitle ??= getDefaultAppTitle(routeObj.pathname);

    appRouteInfo.htmlDocTitle ??= getDefaultHtmlDocTitle(
      routeObj.pathname,
      appRouteInfo.appTitle
    );

    routesArr.push(appRouteInfo);
    return routeObj;
  };

  const routes = Object.freeze({
    database: addRoute("database"),
    databasesRoot: addRoute({
      pathname: "databases",
      appTitle: "Existing databases",
    }),
  });

  return { routes, routesArr };
};

export const { routes, routesArr } = createRoutesObj();

export const appRoutes = Object.freeze({
  databasesRoot: getRouteTemplate(routes.databasesRoot.pathname),
  database: getRouteTemplate(routes.database.pathname),
});

export const getRouteInfo = (pathname: string) => {
  pathname = trmrk.trimStr(pathname, {
    trimStr: "/",
    trimStart: true,
  });

  const routeInfo =
    routesArr.find((route) => route.pathname === pathname) ?? null;

  return routeInfo;
};
