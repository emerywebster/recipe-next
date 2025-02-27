import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import AppLayout from '@/app/components/layout/AppLayout';

export default function NotFound() {
  return (
    <AppLayout>
      <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/recipe">Browse Recipes</Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
