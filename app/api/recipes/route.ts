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
      // Return empty data array for unauthenticated users
      return NextResponse.json({
        message: 'Not authenticated',
        sampleData: false,
        data: [],
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
