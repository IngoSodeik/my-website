'use client';

import React, { useEffect, useRef, useState } from 'react'
import { asImageSrc, Content, isFilled } from '@prismicio/client';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useParams } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

const localeMap: Record<string, string> = {
  'en': 'en-us',
  'de': 'de-de',
};

type ContentListProps = {
  items: Content.ProjectPostDocument[] | Content.MoviePostDocument[];
  contentType: Content.ContentIndexSlice['primary']['content_type'];
  viewMoreText: Content.ContentIndexSlice['primary']['view_more_text'];
  fallbackItemImage: Content.ContentIndexSlice['primary']['fallback_item_image'];
  prismicLocale: string;
}

export default function contentList({
    items, 
    contentType, 
    viewMoreText = "View", 
    fallbackItemImage,
    prismicLocale
  }: ContentListProps) {

  const component = useRef(null);
  const revealRef = useRef(null);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const [currentItem, setCurrentItem] = useState<null | number>(null);
  const [hovering, setHovering] = useState(false);
  
  // Get the current locale from the URL
  const params = useParams();
  const locale = params?.locale as string || "en";
  
  const urlPrefix = `/${locale}${contentType === 'Movies' ? '/movies' : '/projects'}`;

  // Sort items by date (newest first)
  const sortedItems = [...items].sort((a, b) => {
    if (isFilled.date(a.data.date) && isFilled.date(b.data.date)) {
      return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
    }
    return 0;
  }).filter(item => item.lang === prismicLocale); // Only show items matching the current Prismic locale

  useEffect(() => {
    // Animate list-items in with a stagger
    let ctx = gsap.context(() => {
      itemsRef.current.forEach((item) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "elastic.out(1,0.3)",
            scrollTrigger: {
              trigger: item,
              start: "top bottom-=100px",
              end: "bottom center",
              toggleActions: "play none none none",
            },
          },
        );
      });

      return () => ctx.revert(); // cleanup!
    }, component);
  }, []);

  useEffect(() => {
    // Mouse move event listener
    const handleMouseMove = (e: MouseEvent) => {
      const mousePos = { x: e.clientX, y: e.clientY + window.scrollY };
      // Calculate speed and direction
      const speed = Math.sqrt(Math.pow(mousePos.x - lastMousePos.current.x, 2));

      let ctx = gsap.context(() => {
        // Animate the image holder
        if (currentItem !== null) {
          const maxY = window.scrollY + window.innerHeight - 350;
          const maxX = window.innerWidth - 250;

          gsap.to(revealRef.current, {
            x: gsap.utils.clamp(0, maxX, mousePos.x - 110),
            y: gsap.utils.clamp(0, maxY, mousePos.y - 160),
            rotation: speed * (mousePos.x > lastMousePos.current.x ? 1 : -1), // Apply rotation based on speed and direction
            ease: "back.out(2)",
            duration: 1.3,
          });
          gsap.to(revealRef.current, {
            opacity: hovering ? 1 : 0,
            visibility: "visible",
            ease: "power3.out",
            duration: 0.4,
          });
        }
        lastMousePos.current = mousePos;
        return () => ctx.revert(); // cleanup!
      }, component);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [hovering, currentItem]);

  const onMouseEnter = (index: number) => {
    setCurrentItem(index);
    if (!hovering) setHovering(true);
  };

  const onMouseLeave = () => {
    setHovering(false);
    setCurrentItem(null);
  };

  const contentImages = sortedItems.map((item) => {
    const image = isFilled.image(item.data.hover_image)
      ? item.data.hover_image
      : fallbackItemImage;
    const dimensions = contentType === 'Movies' 
      ? { w: 220, h: 320 }
      : { w: 320, h: 220 }; // Adjust dimensions for 'Projects'
    
    return asImageSrc(image, {
      fit: "crop",
      ...dimensions, // Spread the dimensions object
      exp: -10,
    });
  });

  // Preload images
  useEffect(() => {
    contentImages.forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  }, [contentImages]);

  return (
    <div ref={component}>
      <ul 
        className="grid border-b border-b-slate-100" 
        onMouseLeave={onMouseLeave}
      >
        {sortedItems.map((item, index) => (
          <li 
            key={item.uid}
            className="list-item opacity-0f"
            onMouseEnter={() => onMouseEnter(index)}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
          >
            {isFilled.keyText(item.data.title) && (
              <Link 
                href={`${urlPrefix}/${item.uid}`}
                className="flex flex-col justify-between border-t border-t-slate-100 py-10 text-slate-200 md:flex-row"
                aria-label={item.data.title}
              >
                <div className="flex flex-col">
                  <span className="text-3xl font-bold" >
                    {item.data.title}
                  </span>
                  <div className="flex gap-3 text-yellow-400 text-lg font-bold">
                    {item.data.tagname.map((item, index) => (
                      <span key={index}>{item.tagname}</span>
                    ))}
                  </div>
                </div>  
                <span className="ml-auto flex items-center gap-2 text-xl font-medium md:ml-0">
                  {viewMoreText} <MdArrowOutward />
                </span>
              </Link>
            )}
          </li>
        ))}
      </ul>


      {/* HOVER ELEMENT */}
      <div
          className="hover-reveal pointer-events-none absolute left-0 top-0 -z-10 rounded-lg bg-cover bg-center opacity-0 transition-[background] duration-300"
          style={{
            backgroundImage:
              currentItem !== null ? `url(${contentImages[currentItem]})` : "",
            height: contentType === 'Movies' ? '320px' : '220px',
            width: contentType === 'Movies' ? '220px' : '320px',
          }}
          ref={revealRef}
        ></div>
    </div>
  );
}
