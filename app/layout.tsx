import type { Metadata } from "next";
import { Inter, Roboto } from 'next/font/google';
import {ReactNode} from "react";


const inter = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-secondary",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: 'Chironium',
    description: "Outil d'analyse bioacoustique dédié aux chiroptères, permettant d'identifier, visualiser et interpréter leurs signaux acoustiques avec précision.",
    robots: 'noindex',
    icons: { icon: '/favicon.ico' },
    other: {
        'application/ld+json': JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Chironium',
            url: 'https://app.chironium.be',
        }),
        'theme-color': '#ffffff',
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
