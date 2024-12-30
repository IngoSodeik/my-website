import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import React from "react";

/**
 * Props for `TextBlock`.
 */
export type TextBlockProps = SliceComponentProps<Content.TextBlockSlice>;

/**
 * Component for "TextBlock" Slices.
 */
const TextBlock = ({ slice }: TextBlockProps): React.JSX.Element => {
  return (
    <div className="max-w-prose">
      <PrismicRichText field={slice.primary.textblock} />
    </div>
  );
};

export default TextBlock;
