'use client'

import React, { useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { MdCircle } from "react-icons/md";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Bounded from "@/components/bounded";
import Heading from "@/components/heading";

gsap.registerPlugin(ScrollTrigger);

/**
 * Props for `Titles`.
 */
export type TitlesProps = SliceComponentProps<Content.TitlesSlice>;

/**
 * Component for "Titles" Slices.
 */
const Titles = ({ slice }: TitlesProps): React.JSX.Element => {
  const component = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          // markers: true,        // Delete this before production
          trigger: component.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 5,
        },
      });

      tl.fromTo(".job-row", {
        x: (index) => {
          return index % 2 === 0
            ? gsap.utils.random(400, 300)
            : gsap.utils.random(-400, -300);
        },
      }, {
        x: (index) => {
          return index % 2 === 0
            ? gsap.utils.random(-400, -300)
            : gsap.utils.random(400, 300);
        },
        ease: "power1.inOut",

      });
    }, component);
    return () => ctx.revert();
  });
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="overflow-hidden lg:mt-20 md:mt-12 mt-0"
      ref={component}
    >
      <Bounded as="div">
      <Heading as="h2" size="xl" className="mb-8">
          {slice.primary.heading}
        </Heading>
      </Bounded>
      {slice.primary.job_titles.map((item, index) => (
        <div 
          key={index}
          className="job-row mb-8 flex items-center justify-center gap-4 text-slate-700"
          aria-label={item.job_title || undefined}
        >
          {Array.from({length: 15}, (_, index) => (
            <React.Fragment key={index}>
              <span 
                className="job-item text-6xl sm:text-8xl font-extrabold uppercase tracking-tighter"
                style={{
                  color: index === 7 && item.job_title_color ? item.job_title_color : "inherit",
                }}
              >
                {item.job_title}
              </span>
              <span className="text-3xl sm:text-2xl">
                <MdCircle />
              </span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </section>
  );
};

export default Titles;
