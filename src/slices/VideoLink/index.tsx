import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `VideoLink`.
 */
export type VideoLinkProps = SliceComponentProps<Content.VideoLinkSlice>;

/**
 * Component for "VideoLink" Slices.
 */
const VideoLink = ({ slice }: VideoLinkProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for video_link (variation: {slice.variation}) Slices
    </section>
  );
};

export default VideoLink;
