import AppLayout from '@/app/components/layout/AppLayout';
import RecipeDetail from '@/app/components/RecipeDetail';

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  return (
    <AppLayout>
      <RecipeDetail id={params.id} />
    </AppLayout>
  );
}
