import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Get the session cookies to check authentication
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();

    // Check for any Supabase auth cookies
    const hasAuthCookie = allCookies.some(
      (cookie) => cookie.name.includes('sb-') && cookie.name.includes('auth') && cookie.value
    );

    if (!hasAuthCookie) {
      // Return sample data for unauthenticated users
      return NextResponse.json({
        message: 'Not authenticated',
        sampleData: true,
        data: [
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
        ],
      });
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
      return NextResponse.json({ error: error.message }, { status: 500 });
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
      };
    });

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error('Error in recipes API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
