"use client";

import clsx from "clsx";
import React from "react";
import { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import Link from "next/link";
import Bounded from "@/components/bounded";
import { isFilled, asLink } from "@prismicio/client";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa6";
import { SiCrewunited } from "react-icons/si";
import { useParams } from "next/navigation";

interface SettingsWithTranslations extends Content.SettingsDocument {
  translations: {
    [key: string]: Content.SettingsDocument;
  };
}

export default function Footer({
  settings
}: {
  settings: SettingsWithTranslations;
}) {
  const params = useParams();
  const locale = params?.locale as string || "en";

  // Get the correct language version of settings
  const localizedSettings = settings.translations[locale] || settings;

  return (
    <Bounded as="footer" className="text-slate-600">
      <div className="container mx-auto mt-20 flex flex-col items-center justify-between gap-6 py-8 sm:flex-row ">
        <div className="name flex flex-col items-center justify-center gap-x-4 gap-y-2 sm:flex-row sm:justify-self-start">
          <Link
            href={`/${locale}`}
            className="text-xl font-extrabold tracking-tighter text-slate-100 transition-colors duration-150 hover:text-yellow-400"
          >
            {localizedSettings.data.name}
          </Link>
          <span
            className="hidden text-5xl font-extralight leading-[0] text-slate-400 sm:inline"
            aria-hidden={true}
          >
            /
          </span>
          <Link 
            href={`/${locale}/impressum`}
            className="text-sm text-slate-300 transition-colors duration-150 hover:text-yellow-400"
          >
            © {new Date().getFullYear()} {localizedSettings.data.name}
          </Link>
        </div>
        <nav className="navigation" aria-label="Footer Navigation">
          <ul className="flex items-center gap-1">
            {localizedSettings.data.nav_item.map(({ link, label }, index) => {
              const linkUrl = asLink(link) as string;
              const localizedLink = linkUrl.startsWith(`/${locale}`) ? linkUrl : `/${locale}${linkUrl}`;

              return (
                <React.Fragment key={label}>
                  <li>
                    <Link
                      href={localizedLink}
                      className={clsx(
                        "group relative block overflow-hidden rounded px-3 py-1 text-slate-100 text-base transition-colors duration-150 hover:text-yellow-400",
                        index === localizedSettings.data.nav_item.length - 1
                          ? "font-normal text-sm"
                          : "font-bold"
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                  {index < localizedSettings.data.nav_item.length - 1 && (
                    <span
                      className="text-4xl font-thin leading-[0] text-slate-400"
                      aria-hidden="true"
                    >
                      /
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </nav>
        <div className="socials inline-flex justify-center sm:justify-end">
          {isFilled.link(localizedSettings.data.github) && (
            <PrismicNextLink
              field={localizedSettings.data.github}
              className="p-2 text-2xl text-slate-300 transition-all duration-150 hover:scale-125 hover:text-yellow-400"
              aria-label={localizedSettings.data.name + " on GitHub"}
            >
              <FaGithub />
            </PrismicNextLink>
          )}
          {isFilled.link(localizedSettings.data.crewunited) && (
            <PrismicNextLink
              field={localizedSettings.data.crewunited}
              className="p-2 text-2xl text-slate-300 transition-all duration-150 hover:scale-125 hover:text-yellow-400"
              aria-label={localizedSettings.data.name + " on Twitter"}
            >
              <SiCrewunited />
            </PrismicNextLink>
          )}
          {isFilled.link(localizedSettings.data.linkedin) && (
            <PrismicNextLink
              field={localizedSettings.data.linkedin}
              className="p-2 text-2xl text-slate-300 transition-all duration-150 hover:scale-125 hover:text-yellow-400"
              aria-label={localizedSettings.data.name + " on LinkedIn"}
            >
              <FaLinkedin />
            </PrismicNextLink>
          )}
        </div>
      </div>
    </Bounded>
  );
}