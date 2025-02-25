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
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
