import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({variable: "--font-inter", subsets: ["latin"], display: "swap"});

export const metadata = {
    title: "FitVision AI - Real-time Exercise Analysis",
    description: "AI-powered exercise tracking with real-time pose detection and analytics",
    manifest: "/manifest.json",
    themeColor: "#00d4ff",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "FitVision AI"
    },
    icons: {
        icon: [
            {
                url: "/icon-192.png",
                sizes: "192x192",
                type: "image/png"
            }, {
                url: "/icon-512.png",
                sizes: "512x512",
                type: "image/png"
            },
        ],
        apple: [
            {
                url: "/icon-192.png",
                sizes: "192x192",
                type: "image/png"
            },
        ]
    },
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
        userScalable: false
    }
};

export default function RootLayout({children}) {
    return (<html lang="en">
        <head>
            <meta name="application-name" content="FitVision AI"/>
            <meta name="apple-mobile-web-app-capable" content="yes"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
            <meta name="apple-mobile-web-app-title" content="FitVision AI"/>
            <meta name="mobile-web-app-capable" content="yes"/>
            <meta name="msapplication-TileColor" content="#0a0f1a"/>
            <link rel="apple-touch-icon" href="/icon-192.png"/>
        </head>
        <body classname={
            inter.variable
        }> {children} </body>
    </html>);
}
