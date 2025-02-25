import AppLayout from '@/app/components/layout/AppLayout';
import RecipeEditForm from '@/app/components/RecipeEditForm';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function RecipeEditPage({ params }: { params: { id: string } }) {
  // Server-side auth check
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('sb-auth-token');

  if (!sessionCookie) {
    redirect('/');
  }

  return (
    <AppLayout>
      <RecipeEditForm id={params.id} />
    </AppLayout>
  );
}
