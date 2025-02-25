'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthDialog } from '@/app/components/auth/AuthDialog';
import { useAuth } from '@/app/lib/auth';

export default function LoginPage() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      router.push('/');
    }
  };

  return <AuthDialog open={isOpen} onOpenChange={handleOpenChange} />;
}
