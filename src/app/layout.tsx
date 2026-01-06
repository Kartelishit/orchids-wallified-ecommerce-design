import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";
import AnnouncementStrip from "@/components/layout/AnnouncementStrip";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "WALLIFIED | Premium Posters & Wall Decor",
  description: "Build walls that feel like YOU. High-quality posters, 3-poster collections, and custom designs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-black font-sans">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="9d2919b8-9e68-4c70-9a71-6175f2e26831"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "WALLIFIED", "version": "1.0.0"}'
        />
        <AdminProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
                <div className="fixed top-0 left-0 right-0 z-[110]">
                  <Header />
                  <AnnouncementStrip />
                </div>
              <main className="flex-grow pt-[112px]">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AdminProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
