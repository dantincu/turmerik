export interface RouteParam {
  param: string;
  paramName: string;
}

const getRouteParam = (paramName: string) =>
  ({
    param: `:${paramName}`,
    paramName: paramName,
  } as RouteParam);

export const dbNameParam = getRouteParam("dbName");
export const dbStoreNameParam = getRouteParam("dbStoreName");
export const dbStoreRecordPkParam = getRouteParam("dbStoreRecordPk");

const getRouteTemplate = (
  routeName: string,
  hasDbName: boolean = false,
  hasDbStoreName: boolean = false,
  hasDbRecord: boolean = false
) => {
  const partsArr = ["", routeName];

  if (hasDbName) {
    partsArr.push(dbNameParam.param);

    if (hasDbStoreName) {
      partsArr.push(dbStoreNameParam.param);

      if (hasDbRecord) {
        partsArr.push(dbStoreRecordPkParam.param);
      }
    }
  }

  let routeTemplate = partsArr.join("/");
  return routeTemplate;
};

export const getRoute = (
  routeName: string,
  dbName: string | null = null,
  dbStoreName: string | null = null,
  dbStoreRecordPk: string | null = null
) => {
  const partsArr = ["", routeName, dbName, dbStoreName, dbStoreRecordPk]
    .filter((part) => typeof part === "string")
    .map((part) => encodeURIComponent(part!));

  const routeStr = partsArr.join("/");
  return routeStr;
};

export const routes = Object.freeze({
  databases: "databases",
  datastores: "datastores",
  datarecords: "datarecords",
});

export const appRoutes = Object.freeze({
  databasesRoot: getRouteTemplate(routes.databases),
  databases: getRouteTemplate(routes.databases, true),
  datastoresRoot: getRouteTemplate(routes.datastores, true),
  datastores: getRouteTemplate(routes.datastores, true, true),
  datarecordsRoot: getRouteTemplate(routes.datarecords, true, true),
  datarecords: getRouteTemplate(routes.datarecords, true, true, true),
});