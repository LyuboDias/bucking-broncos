import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // Simply pass through all requests without any auth checks
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 