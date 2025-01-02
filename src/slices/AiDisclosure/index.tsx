'use client' 
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { useParams } from "next/navigation";
import Bounded from "@/components/bounded";

interface AiDisclosureSlice {
  id: string;
  slice_type: "ai_disclosure";
  slice_label: string | null;
  variation: "default";
  version: string;
  primary: {
    german_text: string;
    english_text: string;
  };
  items: never[];
}

/**
 * Props for `AiDisclosure`.
 */
export type AiDisclosureProps = SliceComponentProps<AiDisclosureSlice>;

/**
 * Component for "AiDisclosure" Slices.
 */
const AiDisclosure = ({ slice }: AiDisclosureProps): React.JSX.Element => {
  const params = useParams();
  const locale = params.locale as string;

  const text = locale === "de" ? `Teile dieser Seite wurden mit KI generiert und/oder übersetzt.` : `Some Parts of this site have been generated with AI or translated using AI.`;

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="mt-4 flex justify-end">
        <div className="text-sm text-slate-400 italic">
          {text}
        </div>
      </div>
    </Bounded>
  );
};

export default AiDisclosure; 