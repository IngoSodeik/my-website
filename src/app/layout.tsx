import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import clsx from "clsx";
import { PrismicPreview } from "@prismicio/next";
import { createClient, repositoryName } from "@/prismicio";
import { headers } from "next/headers";

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
  
  // Get the current locale from the URL
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.split('/')[1] || "en";
  
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
    <html lang={locale} className={clsx("bg-black text-slate-100", urbanist.className)}>
      <body className="relative min-h-screen">
        <Header settings={settings} />
        {children}
        {modal}
        <Footer settings={settings} />
        <div className="absolute inset-0 -z-50 max-h-full background-gradient"></div>
        <div className="absolute pointer-events-none inset-0 -z-40 h-full bg-[url('/noisetexture.jpg')] opacity-20 mix-blend-soft-light"></div>
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
