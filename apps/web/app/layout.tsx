import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QuizzMe - Cosmic Learning Journey',
  description: 'Discover your cosmic potential through personalized quizzes and astrological insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
