import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import "@copilotkit/react-ui/styles.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Cofacts.ai — AI 協助公民查核",
  description:
    "對話式 AI 查核協作平台，讓查核協作者可透過 AI 輔助查核可疑訊息、撰寫回應。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${notoSansTC.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
