import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { UserProvider } from "@/context/user-context";
import { WebSocketProvider } from "@/context/websocket-context";
import { Analytics } from "@vercel/analytics/next";
import { PWAProvider } from "@/components/pwa/PWAProvider";
import { LanguageProvider } from "@/context/language-context";
import { TopToastProvider } from "@/components/ui/toast";
import { NotificationProvider } from "@/context/notification-context";

export const metadata: Metadata = {
  title: "Vina - Mental Wellness Companion",
  description: "Your AI companion for mental wellness and emotional support",
  // Only include PWA metadata in production or when PWA is enabled
  ...(process.env.NODE_ENV === "production" ||
  process.env.NEXT_PUBLIC_DISABLE_PWA !== "true"
    ? {
        manifest: "/site.webmanifest",
        appleWebApp: {
          capable: true,
          statusBarStyle: "default",
          title: "Vina",
        },
      }
    : {}),
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Vina",
    title: "Vina - Mental Wellness Companion",
    description: "Your AI companion for mental wellness and emotional support",
  },
  twitter: {
    card: "summary",
    title: "Vina - Mental Wellness Companion",
    description: "Your AI companion for mental wellness and emotional support",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#013F25" },
    { media: "(prefers-color-scheme: dark)", color: "#83CD20" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background-white dark:bg-dark-bg-50 text-black dark:text-white transition-colors duration-300">
        <Analytics />
        <TopToastProvider>
          <LanguageProvider>
            <ThemeProvider>
              <UserProvider>
                <WebSocketProvider>
                  <NotificationProvider>
                    <PWAProvider>{children}</PWAProvider>
                  </NotificationProvider>
                </WebSocketProvider>
              </UserProvider>
            </ThemeProvider>
          </LanguageProvider>
        </TopToastProvider>
      </body>
    </html>
  );
}
