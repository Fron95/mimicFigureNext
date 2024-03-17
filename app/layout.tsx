

// 다크모드
import { ThemeProvider } from "@/components/theme-provider";
// 메타데이터
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
// 스타일
import "./globals.css";
// 다국어 사이트
import { appWithTranslation } from "next-i18next";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home | Figure's Talk",
  description: "Select & Talk with historical figures",
};

// navigation
import Navigation from "@/components/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div>
            <Navigation />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
