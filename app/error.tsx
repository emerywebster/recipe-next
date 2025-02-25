'use client';

import { useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import AppLayout from '@/app/components/layout/AppLayout';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <AppLayout>
      <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter text-destructive mb-4">Something went wrong!</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          We're sorry, but an unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            Go to Home
          </Button>
        </div>
        <div className="mt-8 p-4 bg-muted rounded-md text-left max-w-lg overflow-auto">
          <p className="font-mono text-sm text-muted-foreground">{error.message || 'Unknown error'}</p>
        </div>
      </div>
    </AppLayout>
  );
}
