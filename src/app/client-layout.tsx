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
  
  // Determine gradient based on route
  const getGradientClass = () => {
    const path = segments[1]; // Get the path after locale
    switch (path) {
      case 'projects':
        return 'background-gradient-green';
      case 'movies':
        return 'background-gradient-red';
      case 'about':
        return 'background-gradient-blue';
      case 'impressum':
        return 'background-gradient-slate';
      default:
        return 'background-gradient-default';
    }
  };

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
      <div className={clsx("absolute inset-0 -z-50 max-h-full", getGradientClass())}></div>
      <div className="absolute pointer-events-none inset-0 -z-40 h-full bg-[url('/noisetexture.jpg')] opacity-20 mix-blend-soft-light"></div>
    </>
  );
} 