import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/siteshell";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aleks — Defense-Oriented Product Designer",
  description: "Strategic product design, alignment, and decision-ready systems",
  metadataBase: new URL("https://wilmsas.net"),
  openGraph: {
    title: "Aleks — Product Designer",
    description: "Strategic product design, alignment, and decision-ready systems",
    url: "https://wilmsas.net",
    siteName: "Aleks Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aleks — Product Designer",
    description: "Strategic product design, alignment, and decision-ready systems",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
