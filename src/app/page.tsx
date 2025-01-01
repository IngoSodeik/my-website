import { redirect } from 'next/navigation'

export default function RootPage() {
  // Fallback redirect to English if middleware somehow doesn't catch it
  redirect('/en')
} 