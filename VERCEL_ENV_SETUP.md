# Setting Up Environment Variables in Vercel

The error you're seeing (`Error: supabaseUrl is required`) indicates that your Supabase environment variables aren't being properly loaded in your Vercel deployment.

## Required Environment Variables

Based on your `.env.example` file and the error message, you need to set the following environment variables in Vercel:

1. `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
3. `SUPABASE_PROJECT_ID` - Your Supabase project ID

## Setting Up Environment Variables in Vercel

1. **Go to your Vercel Dashboard**:

   - Navigate to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Access Environment Variables**:

   - Click on the "Settings" tab
   - Select "Environment Variables" from the left sidebar

3. **Add Each Environment Variable**:

   - Click "Add New" for each variable
   - Enter the name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Enter the value (e.g., `https://your-project-id.supabase.co`)
   - Select the environments where it should be available (Production, Preview, Development)
   - Click "Save"

4. **Repeat for All Variables**:

   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Add `SUPABASE_PROJECT_ID`

5. **Redeploy Your Application**:
   - After setting all environment variables, go to the "Deployments" tab
   - Find your latest deployment
   - Click the three dots menu (⋮) and select "Redeploy"

## Code Changes Made

I've updated your `app/lib/supabase.ts` file to better handle missing environment variables:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );

  // In production, we'll throw an error
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Supabase environment variables are required in production.');
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
```

This change:

1. Provides more descriptive error messages
2. Only throws errors in production (allowing development to continue with placeholders)
3. Uses placeholder values as a fallback to prevent runtime errors

## Verifying Environment Variables

To verify that your environment variables are correctly set:

1. Go to the "Deployments" tab
2. Click on your latest deployment
3. Check the build logs for any environment-related errors

## Troubleshooting

If you continue to see the same error after setting environment variables:

1. **Check Variable Names**: Ensure the variable names match exactly what's expected in your code
2. **Check for Typos**: Verify there are no typos in the variable values
3. **Rebuild from Scratch**: Try triggering a completely new build instead of redeploying
4. **Check Server vs. Client Usage**: Ensure you're using the environment variables correctly for server vs. client components

## Important Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Non-prefixed variables are only available on the server side
- If you're using environment variables in both client and server components, make sure they're properly prefixed
