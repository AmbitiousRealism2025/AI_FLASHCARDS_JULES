import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FlashcardProvider } from "@/contexts/FlashcardContext"; // Import the provider
import { Toaster } from 'react-hot-toast'; // Import Toaster

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GemFlash AI Flashcards", // Updated title
  description: "Learn AI concepts with GemFlash, powered by Next.js and Genkit.", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FlashcardProvider> {/* Wrap children with the provider */}
          <Toaster 
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          {children}
        </FlashcardProvider>
      </body>
    </html>
  );
}
