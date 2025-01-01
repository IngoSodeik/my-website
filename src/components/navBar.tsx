"use client";

import clsx from "clsx";
import React, { useState } from "react";
import { Content, KeyTextField, asLink } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import Link from "next/link";
import { MdMenu, MdClose } from "react-icons/md";
import Button from "./button";
import { usePathname, useParams } from "next/navigation";

interface NavItem {
  link: Content.SettingsDocumentDataNavItemItem['link'];
  label: Content.SettingsDocumentDataNavItemItem['label'];
}

interface SettingsWithTranslations extends Content.SettingsDocument {
  translations: {
    [key: string]: Content.SettingsDocument;
  };
}

// Language switcher component
function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const targetLocale = currentLocale === 'en' ? 'de' : 'en';
  const newPathname = pathname.replace(`/${currentLocale}`, `/${targetLocale}`);

  return (
    <Link
      href={newPathname}
      className="ml-6 flex items-center rounded-full border-2 border-slate-900 px-3 py-1 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-900 hover:text-slate-50"
    >
      {targetLocale === 'en' ? 'English' : 'Deutsch'}
    </Link>
  );
}

export default function NavBar({
  settings,
}: {
  settings: SettingsWithTranslations;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const locale = params?.locale as string || "en";

  // Get the correct language version of settings
  const localizedSettings = settings.translations[locale] || settings;
  const navItems = localizedSettings.data.nav_item;

  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-col justify-between rounded-b-lg bg-slate-50 px-4 py-2 md:mb-8 md:flex-row md:items-center md:rounded-xl">
        <div className="flex items-center justify-between">
          <NameLogo name={localizedSettings.data.name} locale={locale} />
          <div className="flex items-center md:hidden">
            <LanguageSwitcher currentLocale={locale} />
            <button
              aria-expanded={open}
              aria-label="Open menu"
              className="block p-2 text-2xl text-slate-800"
              onClick={() => setOpen(true)}
            >
              <MdMenu />
            </button>
          </div>
        </div>
        <div
          className={clsx(
            "fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-end gap-4 bg-slate-50 pr-4 pt-14 transition-transform duration-300 ease-in-out md:hidden",
            open ? "translate-x-0" : "translate-x-[100%]",
          )}
        >
          <button
            aria-label="Close menu"
            aria-expanded={open}
            className="fixed right-4 top-3 block p-2 text-2xl text-slate-800 md:hidden"
            onClick={() => setOpen(false)}
          >
            <MdClose />
          </button>
          {navItems.map((item: NavItem, index: number) => {
            const linkUrl = asLink(item.link) || "";
            const localizedLink = linkUrl.startsWith(`/${locale}`) ? linkUrl : `/${locale}${linkUrl}`;

            return (
              <React.Fragment key={item.label}>
                <li className="first:mt-8">
                  <Link
                    href={localizedLink}
                    className="group relative block overflow-hidden rounded px-3 text-3xl font-bold text-slate-900"
                    onClick={() => setOpen(false)}
                  >
                    <span
                      className={clsx(
                        "absolute inset-0 z-0 h-full translate-y-12 rounded bg-yellow-300 transition-transform duration-300 ease-in-out group-hover:translate-y-0",
                        pathname.includes(linkUrl) ? "translate-y-6" : "translate-y-18",
                      )}
                    />
                    <span className="relative">{item.label}</span>
                  </Link>
                </li>
                {index < navItems.length - 1 && (
                  <span
                    className="hidden text-4xl font-thin leading-[0] text-slate-400 md:inline"
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}
              </React.Fragment>
            );
          })}
          <li>
            <Button
              linkField={localizedSettings.data.cta_link}
              label={localizedSettings.data.cta_label}
              className="ml-3"
            />
          </li>
        </div>
        <div className="hidden items-center md:flex">
          <DesktopMenu settings={localizedSettings} pathname={pathname} locale={locale} />
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </ul>
    </nav>
  );
}

function NameLogo({ name, locale }: { name: KeyTextField; locale: string }) {
  return (
    <Link
      href={`/${locale}`}
      aria-label="Home page"
      className="text-xl font-extrabold tracking-tighter text-slate-900"
    >
      {name}
    </Link>
  );
}

function DesktopMenu({
  settings,
  pathname,
  locale,
}: {
  settings: Content.SettingsDocument;
  pathname: string;
  locale: string;
}) {
  const navItems = settings.data.nav_item;

  return (
    <ul className="flex flex-row items-center gap-1">
      {navItems.map((item: NavItem, index: number) => {
        const linkUrl = asLink(item.link) || "";
        const localizedLink = linkUrl.startsWith(`/${locale}`) ? linkUrl : `/${locale}${linkUrl}`;

        return (
          <React.Fragment key={item.label}>
            <li>
              <Link
                href={localizedLink}
                className={clsx(
                  "group relative block overflow-hidden rounded px-3 py-1 text-base text-slate-900",
                  index === navItems.length - 1
                    ? "font-normal text-sm"
                    : "font-bold"
                )}
                aria-current={pathname.includes(linkUrl) ? "page" : undefined}
              >
                <span
                  className={clsx(
                    "absolute inset-0 z-0 h-full rounded bg-yellow-300 transition-transform duration-300 ease-in-out group-hover:translate-y-0",
                    pathname.includes(linkUrl) ? "translate-y-6" : "translate-y-8",
                  )}
                />
                <span className="relative">{item.label}</span>
              </Link>
            </li>
            {index < navItems.length - 1 && (
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
      <li>
        <Button
          linkField={settings.data.cta_link}
          label={settings.data.cta_label}
          className="ml-3"
        />
      </li>
    </ul>
  );
}