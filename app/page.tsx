import AppLayout from '@/app/components/layout/AppLayout';
import Home from '@/app/components/home';
import { supabase } from '@/app/lib/supabase';
import { cookies } from 'next/headers';

// This function will be executed at build time and then revalidated periodically
export async function generateMetadata() {
  return {
    title: 'Recipe App - Home',
    description: 'Browse and manage your favorite recipes',
  };
}

// This function will be executed at build time and then revalidated periodically
export const revalidate = 3600; // Revalidate every hour

async function getRecipes() {
  try {
    // Get the session cookies to check authentication
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();

    // Check for any Supabase auth cookies
    const hasAuthCookie = allCookies.some((cookie) => cookie.name.includes('sb-') && cookie.value);

    if (!hasAuthCookie) {
      // Return sample data for unauthenticated users
      return [
        {
          id: '1',
          title: 'Homemade Pizza Margherita',
          imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3',
          source: 'italianfoodforever.com',
          rating: 5,
          cookCount: 12,
          tags: ['Italian', 'Comfort Food'],
        },
        {
          id: '2',
          title: 'Fresh Summer Salad',
          imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
          source: 'loveandlemons.com',
          rating: 4,
          cookCount: 8,
          tags: ['Healthy', 'Quick Meals', 'Vegetarian'],
        },
        {
          id: '3',
          title: 'Chocolate Chip Cookies',
          imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
          source: 'sallysbakingaddiction.com',
          rating: 5,
          cookCount: 15,
          tags: ['Desserts', 'Baking'],
        },
      ];
    }

    // For authenticated users, fetch their actual recipes
    const { data, error } = await supabase
      .from('user_recipes')
      .select(
        `
        id,
        rating,
        cook_count,
        last_cooked,
        notes,
        tags,
        created_at,
        recipe:recipe_library(
          id,
          url,
          title,
          image_url,
          description,
          source,
          ingredients,
          instructions
        )
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recipes:', error);
      return [];
    }

    // Format the data for the frontend
    const formattedData = (data || []).map((item) => {
      const recipe = item.recipe as any;

      return {
        id: recipe.id,
        title: recipe.title,
        url: recipe.url,
        imageUrl: recipe.image_url,
        description: recipe.description,
        source: recipe.source,
        rating: item.rating,
        cookCount: item.cook_count,
        lastCooked: item.last_cooked,
        notes: item.notes,
        tags: item.tags || [],
        userRecipeId: item.id,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
      };
    });

    return formattedData;
  } catch (error) {
    console.error('Error in getRecipes:', error);
    return [];
  }
}

export default async function Page() {
  const initialRecipes = await getRecipes();

  return (
    <AppLayout>
      <Home initialRecipes={initialRecipes} />
    </AppLayout>
  );
}
