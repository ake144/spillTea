import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SpillTea - Anonymous Confessions",
    description: "Share your secrets anonymously. No judgment, just vibes.",
    keywords: ["confessions", "anonymous", "secrets", "stories"],
    authors: [{ name: "SpillTea" }],
    openGraph: {
        title: "SpillTea - Anonymous Confessions",
        description: "Share your secrets anonymously. No judgment, just vibes.",
        type: "website",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: "#0a0a0f",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} antialiased`}>
                <main className="min-h-screen bg-background">
                    {children}
                </main>
            </body>
        </html>
    );
}
