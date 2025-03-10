import type { Metadata } from "next";
import "./globals.css";
import { geistMono, geistSans } from "@/config/fonts";
import { Provider } from "@/components";

export const metadata: Metadata = {
  title: {
    template: "%s - Virtual | Shop",
    default: "Home - Virtual | Shop",
  },
  description: "Virtual shop for products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
