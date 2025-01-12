import { Content, LinkField, SelectField, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import React from "react";
import { FaGithub, FaHome, FaLink } from 'react-icons/fa';
import Bounded from "@/components/bounded";

type LinkItem = {
  link_type: SelectField<"GitHub" | "Homepage">;
  link_url: LinkField;
  link_text: SelectField<string>;
}

/**
 * Props for `InterLink`.
 */
export type InterLinkProps = SliceComponentProps<Content.InterLinkSlice>;

const iconMap = {
  GitHub: FaGithub,
  Homepage: FaHome
};

/**
 * Component for "InterLink" Slices.
 */
const InterLink = ({ slice }: InterLinkProps): React.JSX.Element => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >    
      <div className="flex flex-wrap gap-4">
        {slice.items.map((item, index) => {
          const linkType = item.link_type || "Other";
          const Icon = iconMap[linkType as keyof typeof iconMap] || FaLink;
          const url = isFilled.link(item.link_url) ? item.link_url.url : "#";
          const target = isFilled.link(item.link_url) && item.link_url.link_type === "Web" ? "_blank" : "_self";
          
          return (
            <a
              key={index}
              href={url}
              target={target}
              className="flex items-center gap-2 rounded-full border-2 border-slate-800 bg-slate-900 px-5 py-2 text-slate-300 transition-colors hover:border-yellow-400 hover:text-yellow-400"
            >
              <Icon />
              <span>{item.link_text || linkType}</span>
            </a>
          );
        })}
      </div>
    </Bounded>
  );
};

export default InterLink; 