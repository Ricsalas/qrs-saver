import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QRS Saver - Encuentra las mejores ofertas de comida',
  description: 'Recomendaciones inteligentes de ofertas de comida usando IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

