import AppLayout from '@/app/components/layout/AppLayout';
import { Skeleton } from '@/app/components/ui/skeleton';

export default function RecipeLoading() {
  return (
    <AppLayout>
      <div className="container py-8">
        {/* Recipe header skeleton */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <Skeleton className="h-64 w-full md:w-1/3 rounded-lg" />
          <div className="w-full md:w-2/3 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Recipe content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />

            <Skeleton className="h-8 w-1/3 mt-8 mb-4" />
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
