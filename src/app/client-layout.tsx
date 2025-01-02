'use client';

import { useSelectedLayoutSegments } from 'next/navigation';
import Header from "@/components/header";
import Footer from "@/components/footer";
import clsx from "clsx";

export default function ClientLayout({
  children,
  settings,
  params
}: {
  children: React.ReactNode;
  settings: any;
  params: { locale?: string };
}) {
  const segments = useSelectedLayoutSegments();
  const locale = segments[0] === "de" ? "de" : "en";
  const htmlLang = locale === "de" ? "de" : "en";
  
  // Update the html lang attribute
  if (typeof document !== 'undefined') {
    document.documentElement.lang = htmlLang;
  }

  return (
    <>
      <Header settings={settings} />
      <div className="min-h-[calc(75vh)] flex flex-col justify-center">
        {children}
      </div>
      <Footer settings={settings} />
      <div className="absolute inset-0 -z-50 max-h-full background-gradient"></div>
      <div className="absolute pointer-events-none inset-0 -z-40 h-full bg-[url('/noisetexture.jpg')] opacity-20 mix-blend-soft-light"></div>
    </>
  );
} 