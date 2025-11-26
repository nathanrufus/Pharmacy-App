// app/layout.jsx
import "./globals.css";
import Providers from "./providers";
import MainNav from "@/components/Navbar";

export const metadata = {
  title: "Pharmacy App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="border-b border-slate-200 bg-white">
              <div className="mx-auto max-w-7xl px-4 py-3">
                <MainNav />
              </div>
            </header>

            <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
