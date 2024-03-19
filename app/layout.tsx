// 다크모드
import { ThemeProvider } from "@/components/theme-provider";
// 메타데이터
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
// 구글애널리틱스
import { GoogleAnalytics } from "@next/third-parties/google";
// 스타일
import "./globals.css";
// 다국어 사이트

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home | Figure's Talk",
  description: "Select & Talk with historical figures",
  icons: {
    icon: "/image/simple_favicon2.png",
  },
  openGraph: {
    type: "article",
    images: ["/image/simple_favicon2.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/image/simple_favicon2.png"],
  },
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
      <Head>
        <Link rel="icon" href={"/image/simple_favicon2"} />
      </Head>
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
      <GoogleAnalytics gaId="G-H00612T3Z4" />
    </html>
  );
}
