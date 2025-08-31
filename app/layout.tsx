import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { UserProvider } from "@/context/user-context";
import { WebSocketProvider } from "@/context/websocket-context";

export const metadata: Metadata = {
  title: "Vina - Mental Wellness Companion",
  description: "Your AI companion for mental wellness and emotional support",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#013F25" },
    { media: "(prefers-color-scheme: dark)", color: "#83CD20" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background-white dark:bg-dark-bg-50 text-black dark:text-white transition-colors duration-300">
        <ThemeProvider>
          <UserProvider>
            <WebSocketProvider>{children}</WebSocketProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
