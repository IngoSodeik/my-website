import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";

const localeMap: Record<string, string> = {
  'en': 'en-us',
  'de': 'de-de',
};

export default async function ProjectsPage({ params }: { params: { locale: string } }) {
  if (!params?.locale || !localeMap[params.locale]) {
    return notFound();
  }

  const client = createClient();
  const prismicLocale = localeMap[params.locale];

  try {
    const page = await client.getByUID("page", "projects", { lang: prismicLocale });

    return (
      <SliceZone 
        slices={page.data.slices} 
        components={components} 
        context={{ locale: params.locale }}
      />
    );
  } catch (error) {
    console.error('Projects Page Error:', { error, locale: params.locale });
    return notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!params?.locale || !localeMap[params.locale]) {
    return { title: 'Projects' };
  }

  const client = createClient();
  const prismicLocale = localeMap[params.locale];

  try {
    const page = await client.getByUID("page", "projects", { lang: prismicLocale });
    return {
      title: page.data.meta_title || 'Projects',
      description: page.data.meta_description,
    };
  } catch (error) {
    console.error('Metadata Error:', { error, locale: params.locale });
    return { title: 'Projects' };
  }
} 