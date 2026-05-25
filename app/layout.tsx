import "./globals.css";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: Readonly<LayoutProps>) => {
  return (
    <html lang="en" className={"antialiased"}>
      <body>
        <div className="flex justify-center">
          <div className="w-lvw max-w-[600px] p-4">
            <Link href={"/"}>
              <div className="text-sm font-semibold my-4">🥇 Run Rankings</div>
            </Link>

            {children}

            <Analytics />
          </div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
