import { parseRecipeContent } from './recipe-parser';

interface ScrapedRecipe {
  title?: string;
  imageUrl?: string;
  description?: string;
  source?: string;
  ingredients?: string[];
  instructions?: string[];
}

export async function scrapeRecipe(url: string): Promise<ScrapedRecipe> {
  try {
    console.log('Fetching recipe from URL:', url);
    const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}&data.content=true`);
    const data = await response.json();

    if (!response.ok || !data.data) {
      console.error('Microlink API error:', data);
      throw new Error('Failed to fetch recipe content');
    }

    const { data: metadata } = data;
    console.log('Received metadata:', metadata);

    if (!metadata.content && !metadata.description) {
      console.error('No content found in metadata');
      throw new Error('No recipe content found');
    }

    const source = new URL(url).hostname.replace('www.', '');
    const content = metadata.content || metadata.description || '';

    console.log('Extracting ingredients and instructions from content');
    try {
      const { ingredients, instructions } = await parseRecipeContent(url, content);

      return {
        title: metadata.title,
        imageUrl: metadata.image?.url || metadata.logo?.url,
        description: metadata.description,
        source,
        ingredients,
        instructions,
      };
    } catch (parseError) {
      console.error('Error parsing recipe content:', parseError);

      // Check if it's a quota error
      if (
        parseError instanceof Error &&
        (parseError.message.includes('quota exceeded') || parseError.message.includes('API limits'))
      ) {
        throw new Error(
          'Recipe parsing is temporarily unavailable due to API limits. Basic recipe information has been saved.'
        );
      }

      // Return basic recipe info for other errors
      return {
        title: metadata.title,
        imageUrl: metadata.image?.url || metadata.logo?.url,
        description: metadata.description,
        source,
      };
    }
  } catch (error) {
    console.error('Error scraping recipe:', error);
    throw new Error('Failed to scrape recipe');
  }
}
