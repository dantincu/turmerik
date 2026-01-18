import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import './globals.scss';

import { ThemeProvider } from "@/src/code/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {/* 1. The Raw HTML Loader */}
        <div id="initial-loader" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white', // We'll handle dark mode below
          color: 'black',
          zIndex: 9999,
          fontFamily: 'sans-serif',
          fontSize: '16px',
        }}>
          <div className="spinner">
            Loading App...
            <style>{`
              .spinner { animation: fadeIn 0.5s infinite alternate; }
              @keyframes fadeIn { from { opacity: 0.5; } to { opacity: 1; } }
              
              /* Immediate Dark Mode support before React */
              .dark #initial-loader { background: #000 !important; color: #fff !important; }
            `}</style>
          </div>
        </div>

        {/* 2. The "Kill Switch" Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // This runs as soon as React is loaded and executing
              window.addEventListener('load', function() {
                var loader = document.getElementById('initial-loader');
                if (loader) {
                  loader.style.display = 'none';
                }
              });
            `,
          }}
        />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
