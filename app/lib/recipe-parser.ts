import { supabase } from './supabase';

interface ParsedRecipe {
  ingredients: string[];
  instructions: string[];
}

export async function parseRecipeContent(url: string, content: string): Promise<ParsedRecipe> {
  try {
    console.log('Sending content to parse-recipe function:', {
      url,
      contentLength: content.length,
      contentPreview: content.substring(0, 200),
    });

    const { data, error } = await supabase.functions.invoke('parse-recipe', {
      body: { url, content },
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }

    if (!data || !data.ingredients || !data.instructions) {
      console.error('Invalid response from parse-recipe function:', data);
      throw new Error('Invalid response format from parse-recipe function');
    }

    return {
      ingredients: data.ingredients,
      instructions: data.instructions,
    };
  } catch (error) {
    console.error('Error parsing recipe content:', error);
    throw error; // Let the caller handle the error
  }
}
