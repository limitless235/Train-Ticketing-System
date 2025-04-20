// app/auth/callback/route.ts
import { createClient } from 'src/utils/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// CORRECT VERSION:
export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    
    if (code) {
      // Await the client creation
      const supabase = await createClient();
      await supabase.auth.exchangeCodeForSession(code);
    }
    
    return NextResponse.redirect(requestUrl.origin);
  }
  
