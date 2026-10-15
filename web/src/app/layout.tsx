import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { JoinProvider } from "@/components/join/JoinProvider";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans-face",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Leveee | Join the private beta",
  description:
    "Leveee is a private relationship companion. It notices when a conversation is starting to go sideways, and offers one calm move before the damage is done.",
  openGraph: {
    title: "Leveee | The fight isn't the problem. The ten seconds before it is.",
    description: "A private relationship companion for the moment your thumb is over send.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f5f0",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${sans.variable} antialiased`}>
      <body className="grain min-h-[100dvh]">
        <JoinProvider>{children}</JoinProvider>
      </body>
    </html>
  );
}
