import type { Metadata } from "next";

import RootLayoutCore from "@/src/trmrk-notes-reactlib/components/pages/layout";
import "../code/components/app-globals.scss";

export const metadata: Metadata = {
  title: "Turmerik Notes",
  description: "Turmerik Notes App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <RootLayoutCore>{children}</RootLayoutCore>
    </html>
  );
}
