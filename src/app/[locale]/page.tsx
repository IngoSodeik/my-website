import { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { notFound } from "next/navigation";

type Params = { locale: string };

// Map our locale codes to Prismic language codes
const localeMap: Record<string, string> = {
  'en': 'en-us',
  'de': 'de-de',
};

export default async function Page({ params }: { params: Params }) {
  if (!params?.locale || !localeMap[params.locale]) {
    console.error('Homepage: Invalid locale:', params);
    return notFound();
  }

  const client = createClient();
  const prismicLocale = localeMap[params.locale];

  try {
    const page = await client.getSingle("homepage", { 
      lang: prismicLocale,
    });

    if (!page?.data?.slices) {
      console.error('Homepage: Missing data:', { locale: params.locale, prismicLocale });
      return notFound();
    }

    return <SliceZone slices={page.data.slices} components={components} />;
  } catch (error) {
    console.error('Homepage: Error:', { error, locale: params.locale, prismicLocale });
    return notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  if (!params?.locale || !localeMap[params.locale]) {
    return { title: 'Homepage' };
  }

  const client = createClient();
  const prismicLocale = localeMap[params.locale];

  try {
    const page = await client.getSingle("homepage", { lang: prismicLocale });
    return {
      title: page.data.meta_title || 'Homepage',
      description: page.data.meta_description,
    };
  } catch (error) {
    console.error('Metadata: Error:', { error, locale: params.locale });
    return { title: 'Homepage' };
  }
}

export async function generateStaticParams() {
  return Object.keys(localeMap).map((locale) => ({ locale }));
} 