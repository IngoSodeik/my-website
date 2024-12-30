'use client';

import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export type ScrollDownIndicatorProps = SliceComponentProps<Content.ScrollDownIndicatorSlice>;

const ScrollDownIndicator = ({ slice }: ScrollDownIndicatorProps) => {
  const containerRef = useRef(null);
  const bounceRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      console.log('Scroll detected');
      setHasScrolled(true);
      if (containerRef.current) {
        // First fade out
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            console.log('Fade out complete');
            // Only hide after fade out is complete
            if (containerRef.current) {
              gsap.set(containerRef.current, { display: 'none' });
            }
          }
        });
      }
      window.removeEventListener('scroll', handleScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle initial appearance
  useEffect(() => {
    console.log('Component mounted');

    // Show indicator after 3 seconds if user hasn't scrolled
    timeoutRef.current = setTimeout(() => {
      console.log('Timer fired, hasScrolled:', hasScrolled);
      if (!hasScrolled && containerRef.current) {
        console.log('Starting fade in');
        gsap.set(containerRef.current, { display: 'block' });
        gsap.to(containerRef.current, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => console.log('Fade in complete')
        });
      }
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasScrolled]);

  // Handle bounce animation
  useEffect(() => {
    if (!bounceRef.current || hasScrolled) return;

    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "power1.inOut" }
    });

    tl.to(bounceRef.current, {
      y: 10,
      duration: 0.8
    })
    .to(bounceRef.current, {
      y: 0,
      duration: 0.8
    });

    return () => {
      tl.kill();
    };
  }, [hasScrolled]);

  const handleClick = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <div 
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 opacity-0"
      ref={containerRef}
    >
      <div
        ref={bounceRef}
        className="cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium">Scroll Down</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L12 20M12 20L18 14M12 20L6 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ScrollDownIndicator; 