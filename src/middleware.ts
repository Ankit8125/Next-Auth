import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export function middleware(request: NextRequest) {

  const path = request.nextUrl.pathname // we need to locate where the user is currently, then only i can do some validation checks 

  const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail'

  const token = request.cookies.get('token')?.value || '' // to check if the user is logged in or not -> we see the token which is present in cookies

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

}


// See "Matching Paths" below to learn more
export const config = { // If i go to these routes -> run this middleware file is the meaning of this
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup',
    '/verifyemail',
    '/profile/:path*',  // Matches any dynamic routes under /profile
  ]
}