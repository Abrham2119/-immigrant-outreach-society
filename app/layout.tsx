import { Metadata } from "next";
// import { Montserrat } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { TranslationProvider } from "@/components/providers/translation.provider";
import "../styles/globals.css";

// const montserrat = Montserrat({
//   subsets: ["latin"],
//   variable: "--font-montserrat",
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "Canada imigiration support",
  description: "",
  authors: [
    { name: "Abreham zewdu" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={`antialiased bg-white`} cz-shortcut-listen="true" >
        <QueryProvider>
          <AuthProvider>
            <TranslationProvider>
              <div className="bg-white text-black">{children}</div>
            </TranslationProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
