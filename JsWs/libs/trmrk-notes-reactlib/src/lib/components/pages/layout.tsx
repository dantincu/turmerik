import '@/src/trmrk-react/globals.scss';
import '@/src/trmrk-notes-reactlib/lib-globals.scss';

import { initialLoaderHtml, initialLoaderStyles } from "@/src/trmrk-react/initial-loader";
import Trmrk3PanelsAppLayout from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayout";
import IconRegistration from '../../services/iconify/IconRegistration';

import ThemeProvider from "../ThemeProvider/ThemeProvider";
import AppInitializer from "../AppInitializer/AppInitializer";
import { loadAppConfig } from "../../services/appConfig/loadAppConfig";

export default async function RootLayoutCore({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appConfig = await loadAppConfig();

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

        <AppInitializer data={{ appConfig }}>
          <Trmrk3PanelsAppLayout>{children}</Trmrk3PanelsAppLayout>
        </AppInitializer>
      </ThemeProvider>
    </body>
  );
}
