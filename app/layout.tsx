import type { Metadata, Viewport } from "next";
import "./globals.css";
import { UserProvider } from "./contexts/UserContext";

export const metadata: Metadata = {
  title: "Déli Délo - Joue. Révèle-toi. Connecte.",
  description: "L'app dating où on joue AVANT de se parler. Les red flags sortent dans le jeu, pas dans tes DM. Fini les 'Salut ça va ?'",
  keywords: ["rencontres", "dating", "jeux", "gamification", "amour", "amitié", "90s", "arcade"],
  authors: [{ name: "Déli Délo" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Déli Délo",
    startupImage: "/icons/icon-512x512.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://delidelo.app",
    siteName: "Déli Délo",
    title: "Déli Délo - Joue. Révèle-toi. Connecte.",
    description: "L'app dating où on joue AVANT de se parler",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Déli Délo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Déli Délo - Joue. Révèle-toi. Connecte.",
    description: "L'app dating où on joue AVANT de se parler",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FF00FF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Nunito:wght@400;500;600;700;800&family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
