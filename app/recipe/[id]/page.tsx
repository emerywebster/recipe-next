import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import AppLayout from '@/app/components/layout/AppLayout';
import RecipeDetail from '@/app/components/RecipeDetail';
import { supabase } from '@/app/lib/supabase';

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { id: string } }) {
  const recipe = await getRecipe(params.id);

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    };
  }

  return {
    title: `${recipe.title} | Recipe App`,
    description: recipe.description || `View details for ${recipe.title}`,
  };
}

// Set revalidation period
export const revalidate = 3600; // Revalidate every hour

async function getRecipe(id: string) {
  try {
    // Fetch the recipe directly without user filtering
    // This is safe because we're only fetching public recipe data
    const { data, error } = await supabase
      .from('recipe_library')
      .select(
        `
        id,
        url,
        title,
        image_url,
        description,
        source,
        ingredients,
        instructions
      `
      )
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching recipe:', error);
      return null;
    }

    // Format data for frontend with default values for user-specific fields
    return {
      id: data.id,
      title: data.title,
      url: data.url,
      imageUrl: data.image_url,
      description: data.description,
      source: data.source,
      rating: 0,
      cookCount: 0,
      tags: [],
      userRecipeId: '',
      ingredients: data.ingredients || [],
      instructions: data.instructions || [],
    };
  } catch (error) {
    console.error('Error in getRecipe:', error);
    return null;
  }
}

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
  const recipe = await getRecipe(params.id);

  // If recipe not found, show 404 page
  if (!recipe) {
    notFound();
  }

  return (
    <AppLayout>
      <RecipeDetail id={params.id} initialRecipe={recipe} />
    </AppLayout>
  );
}
