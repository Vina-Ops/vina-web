import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { UserProvider } from "@/context/user-context";
import { WebSocketProvider } from "@/context/websocket-context";

export const metadata: Metadata = {
  title: "Vina - Mental Wellness Companion",
  description: "Your AI companion for mental wellness and emotional support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <ThemeProvider>
          <UserProvider>
            <WebSocketProvider>{children}</WebSocketProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
