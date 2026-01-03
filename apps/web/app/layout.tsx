import type { Metadata } from 'next';

import { Providers } from '../components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuizzMe - Dein digitales Selbst',
  description: 'Entdecke dein kosmisches Potenzial durch personalisierte Quizzes und astrologische Einblicke.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <main className="container mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
