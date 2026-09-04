import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ServiceWorkerRegister } from "@/app/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fillo",
  description: "Gérez vos clients et vos ventes depuis WhatsApp avec Fillo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>
        <main className="bg-[#eef0f3] px-0 py-0 md:px-0 md:py-0 lg:px-6">
          {children}
        </main>
        <ServiceWorkerRegister />
        <Analytics />
      </body>
    </html>
  );
}
