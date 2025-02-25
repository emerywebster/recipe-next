'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth';
import { supabase } from '@/app/lib/supabase';
import RecipeDialog from '@/app/components/RecipeDialog';
import { toast } from '@/app/components/ui/use-toast';
import AppLayout from '@/app/components/layout/AppLayout';

interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  url?: string;
  description?: string;
  rating: number;
  notes?: string;
  tags: string[];
  ingredients?: string[];
  instructions?: string[];
  userRecipeId: string;
}

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!params.id || !user) return;

      const { data, error } = await supabase
        .from('user_recipes')
        .select(
          `
          id,
          rating,
          notes,
          tags,
          recipe:recipe_library(
            id,
            url,
            title,
            image_url,
            description,
            ingredients,
            instructions
          )
        `
        )
        .eq('recipe_id', params.id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching recipe:', error);
        toast({
          title: 'Error',
          description: 'Failed to load recipe',
          variant: 'destructive',
        });
        router.push(`/recipe/${params.id}`);
        return;
      }

      if (!data || !data.recipe) {
        console.error('No recipe data found');
        router.push(`/recipe/${params.id}`);
        return;
      }

      // Use any type to bypass TypeScript checks
      const recipeData = data.recipe as any;

      setRecipe({
        id: recipeData.id,
        title: recipeData.title,
        url: recipeData.url,
        imageUrl: recipeData.image_url,
        description: recipeData.description,
        rating: data.rating,
        notes: data.notes,
        tags: data.tags || [],
        userRecipeId: data.id,
        ingredients: recipeData.ingredients || [],
        instructions: recipeData.instructions || [],
      });
    };

    fetchRecipe();
  }, [params.id, user, router]);

  const handleSave = async (recipeData: any) => {
    try {
      // Update the recipe in the library
      const { error: libraryError } = await supabase
        .from('recipe_library')
        .update({
          title: recipeData.title,
          image_url: recipeData.imageUrl,
          description: recipeData.description,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
        })
        .eq('id', params.id);

      if (libraryError) throw libraryError;

      // Update user-specific recipe data
      const { error: userRecipeError } = await supabase
        .from('user_recipes')
        .update({
          rating: recipeData.rating,
          notes: recipeData.notes,
          tags: recipeData.tags,
        })
        .eq('recipe_id', params.id)
        .eq('user_id', user?.id);

      if (userRecipeError) throw userRecipeError;

      toast({
        title: 'Recipe updated',
        description: 'Your recipe has been successfully updated',
      });

      router.push(`/recipe/${params.id}`);
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast({
        title: 'Error',
        description: 'Failed to update recipe',
        variant: 'destructive',
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      router.push(`/recipe/${params.id}`);
    }
  };

  if (!recipe) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-[60vh]">Loading...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <RecipeDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        mode="edit"
        initialData={recipe}
        onSave={handleSave}
      />
    </AppLayout>
  );
}
