import type { Metadata } from 'next';
import { Inter } from 'next/font/google';


// Using Inter font from Google Fonts (built-in with Next.js)
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Clinic WhatsApp Bot',
  description: 'AI-powered WhatsApp bot for clinic appointments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}