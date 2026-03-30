import '@/src/trmrk-react/globals.scss';
import '@/src/trmrk-notes-reactlib/lib-globals.scss';

import { NullOrUndef } from '@/src/trmrk/core';
import { initialLoaderHtml, initialLoaderStyles } from "@/src/trmrk-react/initial-loader";
import Trmrk3PanelsAppLayout from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayout";
import IconRegistration from '@/src/code/services/iconify/IconRegistration';

import ThemeProvider from "../ThemeProvider/ThemeProvider";
import AppInitializer from "../AppInitializer/AppInitializer";
import { loadAppConfig } from "../../services/appConfig/loadAppConfig";
import { AppConfig } from '../../services/appConfig/AppConfig';

export const initializerCore = async (appConfig: AppConfig) => {
};

export default async function RootLayoutCore({
  children,
  beforeInitialized,
  afterInitialized,
}: Readonly<{
  children: React.ReactNode;
  beforeInitialized?: ((appConfig: AppConfig) => Promise<void>) | NullOrUndef;
  afterInitialized?: ((appConfig: AppConfig) => Promise<void>) | NullOrUndef;
}>) {
  const appConfig = await loadAppConfig();

  if (beforeInitialized) {
    await beforeInitialized(appConfig);
  }

  await initializerCore(appConfig);

  if (afterInitialized) {
    await afterInitialized(appConfig);
  }

  return (
    <body className={`antialiased`}>
      <IconRegistration />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

        <style dangerouslySetInnerHTML={{
          __html: initialLoaderStyles}}>
        </style>

        <div id="trmrk-app-initial-loader" dangerouslySetInnerHTML={{
          __html: initialLoaderHtml
        }}></div>

        <AppInitializer>
          <Trmrk3PanelsAppLayout>{children}</Trmrk3PanelsAppLayout>
        </AppInitializer>
      </ThemeProvider>
    </body>
  );
}
