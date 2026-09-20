import type { Metadata } from "next";
import "@/styles/globals.css";
import AppClientLayout from "@/components/layouts/AppClientLayout";
import fonts from "@/packages/configs/font.config";
import seo from "@/packages/seo/index.seo";
export const metadata: Metadata = seo;

interface LayoutProps<_T> {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${fonts.sans} ${fonts.serif} ${fonts.mono} ${fonts.custom} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <AppClientLayout>{children}</AppClientLayout>
      </body>
    </html>
  );
}
