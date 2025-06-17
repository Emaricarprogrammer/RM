import { Navbar } from "../../_components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-PT">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
