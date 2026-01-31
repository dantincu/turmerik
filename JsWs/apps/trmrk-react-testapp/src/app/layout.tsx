import type { Metadata } from "next"; 

import '../trmrk-react/globals.scss';
import "../code/components/app-globals.scss";

import { initialLoaderKillSwitchScript, initialLoaderStyles } from "@/src/trmrk-react/initial-loader";
import Trmrk3PanelsAppLayout from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayout";

import { ThemeProvider } from "@/src/code/components/theme-provider";
import IconRegistration from '@/src/code/services/iconify/IconRegistration';
import AppInitializer from "@/src/code/components/AppInitializer";

export const metadata: Metadata = {
  title: "Turmerik React Test App",
  description: "Test app for Turmerik React components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning is required because next-themes updates the <html> tag */}
      <body
        className={`antialiased`}
      ><IconRegistration /><ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <style dangerouslySetInnerHTML={{
          __html: initialLoaderStyles}}>
        </style>
        <div id="trmrk-app-initial-loader">
          <div className="spinner">
            Loading App...
          </div>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: initialLoaderKillSwitchScript,
          }}
        /><AppInitializer>
          <Trmrk3PanelsAppLayout>{children}</Trmrk3PanelsAppLayout>
          </AppInitializer>
        </ThemeProvider>
      </body>
    </html>
  );
}
