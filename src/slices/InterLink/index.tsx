import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import React from "react";
import { FaGamepad, FaGithub, FaLink } from 'react-icons/fa';
import Bounded from "@/components/bounded";
import Button from "@/components/button";

export type InterLinkProps = SliceComponentProps<Content.InterLinkSlice>;

const iconMap = {
  GitHub: FaGithub,
  Homepage: FaGamepad
};

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
          
          return (
            <Button
              key={index}
              linkField={item.link_url}
              label={item.link_text || linkType}
              showIcon={false}
              icon={Icon}
            />
          );
        })}
      </div>
    </Bounded>
  );
};

export default InterLink; 