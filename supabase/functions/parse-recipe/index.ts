// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import OpenAI from 'https://esm.sh/openai@4.28.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
if (!openaiApiKey) {
  console.error('OpenAI API key not found in environment variables');
  throw new Error('OpenAI API key not configured');
}

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

interface ParsedRecipe {
  ingredients: string[];
  instructions: string[];
}

console.log('Hello from Functions!');

serve(async (req) => {
  console.log('Received request:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      console.log('Method not allowed:', req.method);
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders,
      });
    }

    // Get the request body
    const body = await req.json();
    console.log('Received body:', {
      url: body.url,
      contentLength: body.content?.length,
      contentPreview: body.content?.substring(0, 200),
    });

    const { url, content } = body;

    if (!url || !content) {
      console.log('Missing fields:', { url, content });
      return new Response('Missing required fields', {
        status: 400,
        headers: corsHeaders,
      });
    }

    console.log('Calling OpenAI with content length:', content.length);
    console.log('Content preview:', content.substring(0, 200));

    // Call OpenAI to parse the recipe
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Extract recipe ingredients and instructions. Return JSON with arrays "ingredients" and "instructions".',
        },
        {
          role: 'user',
          content: content,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    console.log('OpenAI response received');

    if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
      throw new Error('Invalid response from OpenAI');
    }

    const responseContent = completion.choices[0].message.content;
    console.log('Raw OpenAI response:', responseContent);

    try {
      const response = JSON.parse(responseContent);
      console.log('Parsed response:', response);

      if (
        !response.ingredients ||
        !response.instructions ||
        !Array.isArray(response.ingredients) ||
        !Array.isArray(response.instructions)
      ) {
        throw new Error('Invalid response format from OpenAI');
      }

      return new Response(
        JSON.stringify({
          ingredients: response.ingredients,
          instructions: response.instructions,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse OpenAI response');
    }
  } catch (error) {
    console.error('OpenAI API error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    // Check for quota exceeded error
    const isQuotaError =
      error.error?.type === 'insufficient_quota' ||
      error.code === 'insufficient_quota' ||
      error.message?.includes('exceeded your current quota');

    return new Response(
      JSON.stringify({
        error: isQuotaError ? 'OpenAI API quota exceeded' : 'Failed to parse recipe',
        details: isQuotaError
          ? 'The recipe parsing service is temporarily unavailable due to API limits. Please try again later.'
          : error.message,
        type: isQuotaError ? 'quota_exceeded' : 'openai_error',
      }),
      {
        status: isQuotaError ? 429 : 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/parse-recipe' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
