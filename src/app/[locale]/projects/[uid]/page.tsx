import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { DateField } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import Bounded from "@/components/bounded";
import Heading from "@/components/heading";

type Params = { locale: string; uid: string };

const localeMap: Record<string, string> = {
  'en': 'en-us',
  'de': 'de-de',
};

export default async function Page({ params }: { params: Params }) {
  const { uid, locale } = params;
  if (!locale || !localeMap[locale]) {
    return notFound();
  }

  const client = createClient();
  const prismicLocale = localeMap[locale];
  
  const page = await client
    .getByUID("project_post", uid, { lang: prismicLocale })
    .catch(() => notFound());
  
  function formatDate(date: DateField) {
    if (isFilled.date(date)) {
      const dateOptions: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };

      return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', dateOptions).format(new Date(date));
    }
    return "";
  }

  const formattedDate = formatDate(page.data.date);

  return (
    <Bounded as="article">
      <div className="rounded-2xl border-2 border-slate-800 bg-slate-900 px-4 py-10 md:px-8 md:py-20">
        <Heading as="h1">{page.data.title}</Heading>
        <div className="flex gap-4 text-yellow-400 text-xl font-bold">
          {page.data.tagname.map((item, index) => (
            <span key={index}>{item.tagname}</span>
          ))}
        </div>
        <p className="mt-8 border-b border-slate-600 text-xl font-medium text-slate-300">
          {formattedDate}
        </p>
        <div className="prose prose-invert mt-12 prose-lg w-full max-w-none md:mt-20">
          <SliceZone slices={page.data.slices} components={components} />
        </div>
      </div>
    </Bounded>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { uid, locale } = params;
  if (!locale || !localeMap[locale]) {
    return { title: 'Not Found' };
  }

  const client = createClient();
  const prismicLocale = localeMap[locale];
  
  const page = await client
    .getByUID("project_post", uid, { lang: prismicLocale })
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const locales = Object.keys(localeMap);
  
  // Get all projects for all locales, but handle missing translations
  const allParams = await Promise.all(
    locales.map(async (locale) => {
      try {
        const prismicLocale = localeMap[locale];
        const pages = await client.getAllByType("project_post", { 
          lang: prismicLocale
        });
        
        // Only generate paths for articles that exist
        if (pages && pages.length > 0) {
          return pages.map((page) => ({
            locale,
            uid: page.uid,
          }));
        }
        return []; // Return empty array if no articles exist for this locale
      } catch (error) {
        console.log(`No project posts found for locale: ${locale}`);
        return []; // Return empty array on error
      }
    })
  );
  
  // Flatten and filter out any empty arrays
  return allParams.flat();
}