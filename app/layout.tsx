import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { Suspense } from "react";
import NavBar from "@/components/NavBar";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "דפי עבודה במתמטיקה",
  description: "יצירת דפי תרגול להדפסה לפי תכנית הלימודים של משרד החינוך",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Suspense>
          <NavBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
