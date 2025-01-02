import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Domain to locale mapping with fixed locales
const fixedDomainLocales: Record<string, string> = {
  'ingosodeik.com': 'en',
  'ingosodeik.de': 'de',
}

export function middleware(request: NextRequest) {
  // Get the hostname without port number
  const hostname = request.headers.get('host') || ''
  // console.log('🚀 Hostname:', hostname)
  const domainWithoutPort = hostname.split(':')[0]
  // console.log('🚀 Domain without port:', domainWithoutPort)

  // If it's a domain with a fixed locale, use that
  if (domainWithoutPort in fixedDomainLocales) {
    const locale = fixedDomainLocales[domainWithoutPort]
    return NextResponse.redirect(
      new URL(`/${locale}${request.nextUrl.pathname}`, request.url),
      { status: 307 }
    )
  }

  // For other domains (including localhost), check browser language
  const acceptLanguage = request.headers.get('accept-language') || ''
  const defaultLocale = acceptLanguage?.toLowerCase().includes('de') ? 'de' : 'en'
  
  return NextResponse.redirect(
    new URL(`/${defaultLocale}${request.nextUrl.pathname}`, request.url),
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
     * - /public (public assets)
     * - /slice-simulator (Prismic slice simulator)
     * - favicon.ico, robots.txt, etc (static files)
     */
    '/((?!api|_next|static|public|sounds|slice-simulator|[\\w-]+\\.\\w+|en|de).*)'
  ]
} 