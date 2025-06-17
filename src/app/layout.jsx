import "./globals.css";

export const metadata = {
  title: "Academia Egaf",
  description: "Egaf Academy Website",
};

import { Rubik } from "next/font/google";

const mainFont = Rubik({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--mainFont",
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-PT" className={mainFont.className}>
      <body>{children}</body>
    </html>
  );
}
