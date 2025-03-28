import '@/app/globals.css';
import { ChatbotButton } from '@/components/chatbot-button';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { VoiceNavigation } from '@/components/voice-navigation';
import { Inter } from 'next/font/google';
import type React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Rajan's Portfolio",
  description: 'AI-Powered Personal Portfolio of Rajan Prajapati',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <ChatbotButton />
          <VoiceNavigation />
        </ThemeProvider>
      </body>
    </html>
  );
}

import './globals.css';
