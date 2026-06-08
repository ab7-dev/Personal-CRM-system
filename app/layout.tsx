import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal CRM Monitor",
  description: "A premium monitor for your personal contacts, interactions, and follow-ups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
