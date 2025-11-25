import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Pharmacy App",
  description: "Community pharmacies online ordering platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
