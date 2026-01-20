import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap" 
});

const manrope = Manrope({ 
  subsets: ["latin"], 
  variable: "--font-manrope",
  display: "swap"
});

export const metadata = {
  title: "Pratidwandhi - AI Exercise Analysis",
  description: "AI-powered exercise tracking with real-time pose detection and analytics",
  manifest: "/manifest.json",
  themeColor: "#ff4d00",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pratidwandhi"
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ]
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <meta name="application-name" content="Pratidwandhi" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Pratidwandhi" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0B0E14" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <div style={{ paddingBottom: '80px' }}>{children}</div>
        <Navbar />
      </body>
    </html>
  );
}
