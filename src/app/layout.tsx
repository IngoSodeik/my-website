import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { PrismicPreview } from "@prismicio/next";
import { createClient, repositoryName } from "@/prismicio";
import ClientLayout from "./client-layout";
import clsx from "clsx";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle("settings");

  return {
    title: settings.data.meta_title,
    description: settings.data.meta_description,
  };
}

export default async function RootLayout({
  children,
  modal,
  params
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: { locale?: string };
}) {
  const client = createClient();
  
  // Fetch both language versions of the settings
  const [enSettings, deSettings] = await Promise.all([
    client.getSingle("settings", { lang: "en-us" }),
    client.getSingle("settings", { lang: "de-de" })
  ]);

  // Combine them into one object for easier access
  const settings = {
    ...enSettings,
    translations: {
      'en': enSettings,
      'de': deSettings
    }
  };

  return (
    <html className={clsx(urbanist.className, "bg-black text-slate-100")}>
      <body className="relative min-h-screen">
        <ClientLayout settings={settings} params={params}>
          {children}
          {modal}
        </ClientLayout>
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
