'use client';

import { useAuth } from '@/app/lib/auth';
import { ProfileForm } from '@/app/components/ProfileForm';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppLayout from '@/app/components/layout/AppLayout';
import { Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // This ensures we only run client-side code after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Always render the layout to prevent layout shift
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-6">
        {loading || !isClient ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading your profile...</p>
          </div>
        ) : user ? (
          <>
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>
            <ProfileForm />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-muted-foreground mb-6">You need to be signed in to view your profile.</p>
            <Button onClick={() => router.push('/login?redirectTo=/profile')}>Sign In</Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
