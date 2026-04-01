import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forcans Ad Creative",
  description: "AI Ad Creative Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <main className="w-screen h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
