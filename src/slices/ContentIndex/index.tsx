import Bounded from "@/components/bounded";
import Heading from "@/components/heading";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import ContentList from "./contentList";
import { createClient } from "@/prismicio";
import { notFound } from "next/navigation";

const localeMap: Record<string, string> = {
  'en': 'en-us',
  'de': 'de-de',
};

/**
 * Props for `ContentIndex`.
 */
export type ContentIndexProps = SliceComponentProps<Content.ContentIndexSlice>;

/**
 * Component for "ContentIndex" Slices.
 */
const ContentIndex = async ({ slice, context }: ContentIndexProps & { context: { locale: string } }): Promise<React.JSX.Element> => {
  const client = createClient();
  const urlLocale = context.locale;
  const prismicLocale = localeMap[urlLocale] || 'en-us';
  
  const projectPosts = await client.getAllByType("project_post", { lang: prismicLocale });
  const moviePosts = await client.getAllByType("movie_post", { lang: prismicLocale });

  const contentType = slice.primary.content_type || "Movies";

  const items = contentType === "Movies" ? moviePosts : projectPosts;

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Heading size="xl" className="mb-8">
        {slice.primary.heading}
      </Heading>
      {isFilled.richText(slice.primary.description) && (
        <div className="prose prose-xl prose-invert mb-10">
          <PrismicRichText field={slice.primary.description} />
        </div>
      )}
      <ContentList 
        items={items} 
        contentType={contentType} 
        viewMoreText={slice.primary.view_more_text}
        fallbackItemImage={slice.primary.fallback_item_image}
        prismicLocale={prismicLocale}
      />
    </Bounded>
  );
};

export default ContentIndex;
