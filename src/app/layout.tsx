import { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import RouteLoader from "@/components/RouteLoader";
import { LoaderProvider } from "@/contexts/LoaderContext";
import { UserProvider } from "@/contexts/UserContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Sky Command Center",
  description: "A command center for managing parking infrastructure",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/images/logo.png" />
      </head>
      <body
        className={`${poppins.variable} antialiased bg-gray-100 dark:bg-gray-900`}
        suppressHydrationWarning
      >
        <LoaderProvider>
          <UserProvider>
            <RouteLoader />
            {children}
          </UserProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
