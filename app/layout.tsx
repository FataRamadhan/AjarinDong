import type {Metadata} from 'next';
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'AjarinDong - Cari Mentor Belajar Hebat',
  description: 'Temukan mentor belajar terbaik, jadwalkan sesi diskusi privat, pantau progres belajar Anda, dan ulas kualitas pengajaran.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable}`}>
      <body className="font-sans antialiased text-[#1C1C1C] bg-[#FBF9F6] min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
