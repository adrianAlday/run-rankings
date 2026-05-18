import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "",
  description: "",
};

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className={"antialiased"}>
      <body>
        <div className="flex justify-center">
          <div className="w-80">
            <Link href={"/"}>
              <div className="text-sm font-semibold my-8">🥇 Run Rankings</div>
            </Link>

            {children}
          </div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
