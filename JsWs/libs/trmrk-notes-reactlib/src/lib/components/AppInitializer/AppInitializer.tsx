'use client';

import TrmrkAppInitializer from "@/src/trmrk-react/components/TrmrkAppInitializer/TrmrkAppInitializer";
import { defaultAppSessionService } from "@/src/trmrk-react/services/appSession/AppSessionService";
import { basicDbAggregator } from '@/src/trmrk-browser/indexedDB/dbAggregators/BasicDbAggregator';
import { appConfig, AppConfig } from "../../services/appConfig/AppConfig";

export default function AppInitializer({
  children,
  data
}: Readonly<{
  children: React.ReactNode;
  data: { appConfig: AppConfig }
}>) {
  return <TrmrkAppInitializer data={data} initialize={async () => {
    appConfig.register(data.appConfig);
    basicDbAggregator.register(data.appConfig.dbObjAppName);
    await defaultAppSessionService.value.initialize();    
  }}>{children}</TrmrkAppInitializer>  
}
