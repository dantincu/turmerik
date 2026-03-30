import { RefLazyValue, FactorySingleton } from "@/src/trmrk/core";

import { BasicAppSettingsDbAdapter } from "../databases/BasicAppSettings";
import { AppSessionsDbAdapter } from "../databases/AppSessions";

export class BasicDbAggregator {
  constructor(public dbObjAppName: string) {}

  basicAppSettings = new RefLazyValue<BasicAppSettingsDbAdapter>(
    () => new BasicAppSettingsDbAdapter(this.dbObjAppName),
  );

  appSessions = new RefLazyValue<AppSessionsDbAdapter>(
    () => new AppSessionsDbAdapter(this.dbObjAppName),
  );
}

export const basicDbAggregator = new FactorySingleton<
  BasicDbAggregator,
  string
>((dbObjAppName) => new BasicDbAggregator(dbObjAppName));
