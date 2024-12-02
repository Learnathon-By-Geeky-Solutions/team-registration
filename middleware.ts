import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sql } from '@/lib/db';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Temporarily bypass admin authentication
  if (path.startsWith('/admin')) {
    return NextResponse.next();
  }

  if (path === '/register') {
    try {
      const config = await sql`
        SELECT registration_open 
        FROM platform_config 
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      
      if (config[0] && !config[0].registration_open) {
        return NextResponse.redirect(new URL('/registration-closed', request.url));
      }
    } catch (error) {
      // If there's an error, allow access to registration
      console.error('Error checking registration status:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/register'],
};