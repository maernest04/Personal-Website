import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1e3d30",
};

export const metadata: Metadata = {
  title: "Ernest Ma | Mahjong Portfolio",
  description:
    "Interactive Hong Kong-style mahjong-themed portfolio of Ernest Ma — Software Engineer & Computer Engineering student at SJSU. Draw tiles to explore my projects, skills, and experience.",
  keywords: [
    "Ernest Ma",
    "portfolio",
    "software engineer",
    "mahjong",
    "SJSU",
    "computer engineering",
    "interactive portfolio",
    "3D portfolio",
  ],
  authors: [{ name: "Ernest Ma" }],
  creator: "Ernest Ma",
  openGraph: {
    title: "Ernest Ma | Mahjong Portfolio",
    description:
      "Draw tiles, explore projects, and discover my story — all at the mahjong table. An interactive 3D portfolio experience.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ernest Ma | Mahjong Portfolio",
    description:
      "An interactive Hong Kong mahjong-themed portfolio. Draw tiles to explore.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
