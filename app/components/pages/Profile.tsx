'use client';

import { useAuth } from '@/app/lib/auth';
import { ProfileForm } from '@/app/components/ProfileForm';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <ProfileForm />
    </div>
  );
}
