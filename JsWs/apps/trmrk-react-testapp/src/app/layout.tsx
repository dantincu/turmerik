import type { Metadata } from "next";

import '../trmrk-react/globals.scss';

import { initialLoaderKillSwitchScript, initialLoaderStyles } from "@/src/trmrk-react/initial-loader";
import TrmrkAppLayout from "@/src/trmrk-react/components/TrmrkAppLayout/TrmrkAppLayout";

import { ThemeProvider } from "@/src/code/components/theme-provider";

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
      ><ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
        />
          <TrmrkAppLayout>{children}</TrmrkAppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
