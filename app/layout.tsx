import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import "antd/dist/reset.css";
import { AuthProvider } from "../hooks/useAuth";
import { ConfigProvider } from "antd";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Data'S Limit - Web Internet Package E-Commerce",
  description: "Buy internet data packages online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} font-sans antialiased`}
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1890ff',
              fontFamily: roboto.style.fontFamily,
            },
          }}
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
