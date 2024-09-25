import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/[components]/Navbar";
import Footer from "@/app/[components]/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "The Daily SunRise",
  description: "An online news portal",
  icons: {
    icon: 'https://cdn-icons-png.flaticon.com/512/330/330703.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/330/330703.png" /> 
      </head>
      <body className={`${inter.className} w-full items-center m-auto`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
