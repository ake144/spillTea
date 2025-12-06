import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "SpillTea | Anonymous Confessions",
        template: "SpillTea | %s",
    },
    description: "Share your secrets anonymously. No judgment, just vibes. Join the tea party today.",
    manifest: "/manifest.json",
    keywords: ["confessions", "anonymous", "secrets", "gossip", "social app", "spill tea"],
    authors: [{ name: "SpillTea" }],
    openGraph: {
        title: "SpillTea - Anonymous Confessions",
        description: "Share your secrets anonymously. No judgment, just vibes.",
        url: "https://spilltea.app",
        siteName: "SpillTea",
        images: [
            {
                url: "/og-image.png", // Ensure this exists or use a placeholder
                width: 1200,
                height: 630,
                alt: "SpillTea Preview",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "SpillTea - Anonymous Confessions",
        description: "Share your secrets anonymously. No judgment, just vibes.",
        images: ["/og-image.png"],
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
