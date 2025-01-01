import React from 'react';
import { Content } from "@prismicio/client";
import NavBar from '@/components/navBar';

interface SettingsWithTranslations extends Content.SettingsDocument {
  translations: {
    [key: string]: Content.SettingsDocument;
  };
}

export default function Header({
  settings
}: {
  settings: SettingsWithTranslations;
}) {
  return (
    <header className="top-0 z-50 mx-auto max-w-7xl md:sticky md:top-4">
      <NavBar settings={settings} />
    </header>
  );
}
