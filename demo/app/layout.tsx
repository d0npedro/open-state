import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Open State – Demo Arbeitsverwaltung',
  description: 'Transparenter Demonstrator für nachvollziehbare Verwaltungsabläufe',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
