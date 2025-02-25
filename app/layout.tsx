import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/app/lib/auth';
import { Toaster } from '@/app/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Tempo Recipe App',
  description: 'A delicious recipe management application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
