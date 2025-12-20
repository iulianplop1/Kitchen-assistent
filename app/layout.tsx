import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KitchenIQ - AI-Powered Kitchen & Health Manager",
  description: "Your Executive Chef and Nutritionist in your pocket",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

