'use client';

import { useAuth } from '@/app/lib/auth';
import { ProfileForm } from '@/app/components/ProfileForm';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AppLayout from '@/app/components/layout/AppLayout';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <ProfileForm />
      </div>
    </AppLayout>
  );
}
