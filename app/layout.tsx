import type { Metadata } from "next";
import "./globals.css";
import { CRMProvider } from "@/hooks/use-contacts";

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
        <CRMProvider>
          {children}
        </CRMProvider>
      </body>
    </html>
  );
}
