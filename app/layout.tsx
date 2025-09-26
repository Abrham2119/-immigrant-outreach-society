import { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../styles/globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/AuthProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

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
    <html  lang="en" suppressHydrationWarning >
      <body className={`antialiased bg-white`}>
        <QueryProvider>
          <AuthProvider>         
            <div className="bg-white text-black">{children}</div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
