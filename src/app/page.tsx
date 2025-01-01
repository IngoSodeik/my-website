import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

// Domain to locale mapping with fixed locales
const fixedDomainLocales: Record<string, string> = {
  'ingosodeik.com': 'en',
  'ingosodeik.de': 'de',
}

export default function RootPage() {
  // Get the hostname and accept-language header
  const headersList = headers()
  const host = headersList.get('host') || ''
  const hostname = host.split(':')[0] // Remove port number if present
  const acceptLanguage = headersList.get('accept-language') || ''

  // If it's a domain with a fixed locale, use that
  if (hostname in fixedDomainLocales) {
    redirect(`/${fixedDomainLocales[hostname]}`)
  }

  // For sodeik.com and localhost, check browser language
  let defaultLocale = 'en'
  if (acceptLanguage.includes('de')) {
    defaultLocale = 'de'
  }

  redirect(`/${defaultLocale}`)
} 