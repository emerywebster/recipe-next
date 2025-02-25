import { MetadataRoute } from 'next';
import { supabase } from '@/app/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URLs that are always available
  const baseUrls = [
    {
      url: 'https://recipe-app.example.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://recipe-app.example.com/login',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://recipe-app.example.com/profile',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ] as MetadataRoute.Sitemap;

  // Try to fetch public recipes for the sitemap
  try {
    const { data: recipes } = await supabase.from('recipe_library').select('id, updated_at').limit(100);

    const recipeUrls = (recipes || []).map((recipe) => ({
      url: `https://recipe-app.example.com/recipe/${recipe.id}`,
      lastModified: recipe.updated_at ? new Date(recipe.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [...baseUrls, ...recipeUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return baseUrls;
  }
}
