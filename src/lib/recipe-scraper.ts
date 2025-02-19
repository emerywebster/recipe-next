interface ScrapedRecipe {
  title?: string;
  imageUrl?: string;
  description?: string;
  source?: string;
}

export async function scrapeRecipe(url: string): Promise<ScrapedRecipe> {
  try {
    const response = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}`,
    );
    const data = await response.json();

    if (!response.ok || !data.data) {
      throw new Error("Failed to fetch recipe");
    }

    const { data: metadata } = data;
    const source = new URL(url).hostname.replace("www.", "");

    return {
      title: metadata.title,
      imageUrl: metadata.image?.url || metadata.logo?.url,
      description: metadata.description,
      source,
    };
  } catch (error) {
    console.error("Error scraping recipe:", error);
    throw new Error("Failed to scrape recipe");
  }
}
