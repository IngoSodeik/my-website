import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

type Params = { locale: string; uid: string };

// Map our locale codes to Prismic language codes
const localeMap: Record<string, string> = {
  'en': 'en-us',
  'de': 'de-de',
};

export default async function Page({ params }: { params: Params }) {
  const { locale, uid } = params;
  const client = createClient();
  const prismicLocale = localeMap[locale] || locale;

  // console.log('Page: Fetching content:', { locale, prismicLocale, uid });

  try {
    const page = await client.getByUID("page", uid, { 
      lang: prismicLocale,
      fetchLinks: ['page.title', 'page.uid']
    });

    // console.log('Page: Content found:', { 
    //   id: page.id,
    //   uid: page.uid,
    //   type: page.type,
    //   lang: page.lang,
    //   alternateLanguages: page.alternate_languages,
    //   hasSlices: !!page.data.slices,
    //   firstSliceType: page.data.slices?.[0]?.slice_type
    // });
    
    return <SliceZone slices={page.data.slices} components={components} />;
  } catch (error) {
    console.error('Page: Error fetching content:', error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, uid } = params;
  const client = createClient();
  const prismicLocale = localeMap[locale] || locale;

  try {
    const page = await client.getByUID("page", uid, { lang: prismicLocale });
    return {
      title: page.data.meta_title,
      description: page.data.meta_description,
    };
  } catch (error) {
    console.error('Page: Error generating metadata:', error);
    notFound();
  }
}

export async function generateStaticParams() {
  const client = createClient();
  
  try {
    const pages = await client.getAllByType("page");
    const locales = ["en", "de"];

    // console.log('Page: Available content:', pages.map(page => ({
    //   id: page.id,
    //   uid: page.uid,
    //   type: page.type,
    //   lang: page.lang,
    //   alternateLanguages: page.alternate_languages
    // })));

    return pages.flatMap((page) =>
      locales.map((locale) => ({
        locale,
        uid: page.uid,
      }))
    );
  } catch (error) {
    console.error('Page: Error getting all pages:', error);
    return [];
  }
}