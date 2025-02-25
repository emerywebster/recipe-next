import AppLayout from '@/app/components/layout/AppLayout';

export default function Loading() {
  return (
    <AppLayout>
      <div className="container flex flex-col items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="text-lg font-medium text-muted-foreground">Loading...</p>
        </div>
      </div>
    </AppLayout>
  );
}
