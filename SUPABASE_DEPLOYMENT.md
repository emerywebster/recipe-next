# Deploying Supabase Edge Functions

This guide will walk you through the process of deploying your Supabase Edge Functions.

## Prerequisites

1. **Supabase CLI**: You need to have the Supabase CLI installed. If you don't have it yet, install it using:

   ```bash
   # Using npm
   npm install -g supabase

   # Using yarn
   yarn global add supabase

   # Using pnpm
   pnpm add -g supabase
   ```

   If you already have the CLI installed, make sure it's up to date:

   ```bash
   # Check your current version
   supabase --version

   # Update to the latest version
   npm install -g supabase@latest
   # or
   yarn global add supabase@latest
   # or
   pnpm add -g supabase@latest
   ```

2. **Supabase Login**: You need to be logged in to your Supabase account:

   ```bash
   supabase login
   ```

   This will open a browser window where you can authorize the CLI to access your Supabase projects.

## Linking Your Project

Before deploying functions, you need to link your local project to your Supabase project:

```bash
supabase link --project-ref YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with your Supabase project ID. You can find this:

- In your `.env.local` file as `SUPABASE_PROJECT_ID`
- In your Supabase dashboard URL: `https://app.supabase.com/project/YOUR_PROJECT_ID`
- By running `echo $SUPABASE_PROJECT_ID` if you have it set in your environment

## Setting Environment Variables

Your `parse-recipe` function requires an OpenAI API key. You need to set this as a secret:

```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key
```

Replace `your_openai_api_key` with your actual OpenAI API key.

## Deploying the Function

Now you can deploy your function:

```bash
supabase functions deploy parse-recipe
```

This will deploy the `parse-recipe` function to your Supabase project.

## Verifying Deployment

To verify that your function has been deployed successfully:

```bash
supabase functions list
```

This should show your `parse-recipe` function in the list of deployed functions.

## Testing the Function

You can test your function using the Supabase CLI:

```bash
supabase functions serve parse-recipe
```

This will serve the function locally for testing.

You can also test it with curl:

```bash
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/parse-recipe' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"url": "https://example.com/recipe", "content": "Recipe content here..."}'
```

## How the Function is Used in the Application

In your application, the `parse-recipe` function is called from `app/lib/recipe-parser.ts`:

```typescript
// In app/lib/recipe-parser.ts
export async function parseRecipeContent(url: string, content: string): Promise<ParsedRecipe> {
  try {
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
    throw error;
  }
}
```

This function is used to parse recipe content from URLs, extracting structured data like ingredients and instructions using OpenAI.

## Invoking the Function from Your Application

Your function is now available at:

```
https://<project-ref>.supabase.co/functions/v1/parse-recipe
```

Make sure your application is configured to use this URL when calling the function.

## Troubleshooting

If you encounter any issues:

1. Check the function logs:

   ```bash
   supabase functions logs parse-recipe
   ```

2. Make sure all required environment variables are set.

3. Verify that your function code is compatible with Deno and the Supabase Edge Runtime.

## Additional Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Deno Documentation](https://deno.land/manual)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
