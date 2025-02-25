import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/app/lib/supabase';

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
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // For authenticated users, fetch their profile
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'No valid session found' }, { status: 401 });
    }

    // Return user profile data
    return NextResponse.json({
      id: session.user.id,
      email: session.user.email,
      display_name: session.user.user_metadata?.display_name || '',
      avatar_url: session.user.user_metadata?.avatar_url || '',
      bio: session.user.user_metadata?.bio || '',
    });
  } catch (error) {
    console.error('Error in profile API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();

    // Check for any Supabase auth cookies
    const hasAuthCookie = allCookies.some(
      (cookie) => cookie.name.includes('sb-') && cookie.name.includes('auth') && cookie.value
    );

    if (!hasAuthCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get the request body
    const body = await request.json();

    // Validate the request body
    if (!body) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // Update the user profile
    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: body.display_name,
        avatar_url: body.avatar_url,
        bio: body.bio,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in profile API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
