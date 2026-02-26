import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootProvider from "@/components/providers/root-provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodHub",
  description: "Your favorite food delivery app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <RootProvider>
          {children}
          <Toaster 
            position="top-center" 
            reverseOrder={false} 
            toastOptions={{
              duration: 5000,
              style: {
                background: "#333",
                color: "#fff",
              },
            }}
          />
        </RootProvider>
      </body>
    </html>
  );
}