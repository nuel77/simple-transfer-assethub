import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {ChakraProviders} from "@/app/providers/chakra";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simple Transfer",
  description: "Transfer tokens between accounts in assethub roccoco",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <ChakraProviders>
              {children}
          </ChakraProviders>
      </body>
    </html>
  );
}
