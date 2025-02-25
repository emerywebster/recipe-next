'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthDialog } from '@/app/components/auth/AuthDialog';
import { useAuth } from '@/app/lib/auth';

export default function LoginPage() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      router.push('/');
    }
  };

  const handleSuccess = () => {
    router.push(redirectTo);
  };

  return <AuthDialog open={isOpen} onOpenChange={handleOpenChange} onSuccess={handleSuccess} />;
}
