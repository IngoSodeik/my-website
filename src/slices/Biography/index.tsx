import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/components/bounded";
import Heading from "@/components/heading";
import Button from "@/components/button";
import Avatar from "./Avatar";
/**
 * Props for `Biography`.
 */
export type BiographyProps = SliceComponentProps<Content.BiographySlice>;

/**
 * Component for "Biography" Slices.
 */
const Biography = ({ slice }: BiographyProps): React.JSX.Element => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="mt-12 grid gap-x-8 gap-y-6 md:grid-cols-[2fr,1fr]">
        <Heading as="h1" size="xl" className="col-start-1">
          {slice.primary.heading}
        </Heading>
        <div className="prose prose-xl- prose-slate prose-invert col-start-1">
          <PrismicRichText field={slice.primary.description} />
        </div>

        {slice.primary.buttongroup && slice.primary.buttongroup.length > 0 && (
          <div className="flex flex-wrap gap-4 col-start-1">
            {slice.primary.buttongroup.map((item) => (
              <Button 
                key={item.buttontext}
                linkField={item.buttonlink} 
                label={item.buttontext} 
              />
            ))}
          </div>
        )}

        <Avatar 
          image={slice.primary.avatar} 
          className="row-start-1 max-w-sm md:col-start-2 md:row-end-3"
        />
      </div>
    </Bounded>
  );
};

export default Biography;
