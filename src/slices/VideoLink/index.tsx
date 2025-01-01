import React from 'react';
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Bounded from '@/components/bounded';

/**
 * Props for `VideoLink`.
 */
export type VideoLinkProps = SliceComponentProps<Content.VideoLinkSlice>;

/**
 * Component for "VideoLink" Slices.
 */
const VideoLink = ({ slice }: VideoLinkProps): React.JSX.Element => {
  const videoEmbed = slice.primary.video;

  if (!videoEmbed || !videoEmbed.embed_url) {
    return (
      <Bounded as="section" className="bg-slate-900">
        <div className="text-center text-slate-500">Video not available</div>
      </Bounded>
    );
  }

  // Ensure we're using the embed URL format
  const embedUrl = videoEmbed.embed_url.replace('watch?v=', 'embed/');

  return (
    <Bounded as="section" className="bg-slate-900">
      <div className="relative pb-[56.25%] h-0 overflow-hidden max-w-5xl mx-auto">
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-xl"
          src={embedUrl}
          title={videoEmbed.title || 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Bounded>
  );
};

export default VideoLink;
