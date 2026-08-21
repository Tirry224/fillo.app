import type { Metadata } from "next";
import { AppStoreProvider } from "@/lib/appStore";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fillo",
  description: "Gérez vos clients et vos ventes depuis WhatsApp avec Fillo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>
        <AppStoreProvider>
          <main className="min-h-screen bg-[#eef0f3] px-0 py-0 sm:px-6 sm:py-10 md:px-0 md:py-0 lg:px-6 lg:py-10">
            {children}
          </main>
        </AppStoreProvider>
      </body>
    </html>
  );
}
