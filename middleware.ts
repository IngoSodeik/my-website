import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Domain to locale mapping with fixed locales
const fixedDomainLocales: Record<string, string> = {
  'ingosodeik.com': 'en',
  'ingosodeik.de': 'de',
}

export function middleware(request: NextRequest) {
  console.log('middleware test');
  // Only run on homepage requests
  if (request.nextUrl.pathname !== '/') {
    return NextResponse.next()
  }

  // Get the hostname without port number
  const hostname = request.headers.get('host') || ''
  const domainWithoutPort = hostname.split(':')[0]

  // If it's a domain with a fixed locale, use that
  if (domainWithoutPort in fixedDomainLocales) {
    return NextResponse.redirect(
      new URL(`/${fixedDomainLocales[domainWithoutPort]}`, request.url),
      { status: 307 }
    )
  }

  // For other domains (including localhost), check browser language
  const acceptLanguage = request.headers.get('accept-language') || ''
  const defaultLocale = acceptLanguage?.toLowerCase().includes('de') ? 'de' : 'en'
  
  return NextResponse.redirect(
    new URL(`/${defaultLocale}`, request.url),
    { status: 307 }
  )
}

// Configure middleware to only run on homepage and ensure no locale is set
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - /api (API routes)
     * - /_next (Next.js internals)
     * - /(en|de) (Already localized paths)
     * - /static (static files)
     * - favicon.ico, robots.txt (static files)
     */
    '/((?!api|_next|static|[\\w-]+\\.\\w+|en|de).*)'
  ]
} 