import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link"; // Always use Link for internal navigation
import { Providers } from "./component/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="h-full bg-[#020617] text-slate-100 flex overflow-hidden">

        {/* --- Main Content Area --- */}
        <main className="flex-1 overflow-y-auto relative">
          <Providers>{children}</Providers>
        </main>

      </body>
    </html>
  );
}