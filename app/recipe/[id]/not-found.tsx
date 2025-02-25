import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import AppLayout from '@/app/components/layout/AppLayout';
import { UtensilsCrossed } from 'lucide-react';

export default function RecipeNotFound() {
  return (
    <AppLayout>
      <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
        <UtensilsCrossed className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-4xl font-extrabold tracking-tighter mb-4">Recipe Not Found</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          We couldn't find the recipe you're looking for. It may have been deleted or never existed.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/recipe">Browse Recipes</Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
