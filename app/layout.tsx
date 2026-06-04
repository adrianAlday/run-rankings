import "./globals.css";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import AboutPageLogger from "./_components/AboutPageLogger";
import LoadingWrapper from "./_components/LoadingWrapper";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: Readonly<LayoutProps>) => (
  <html lang="en" className={"antialiased"}>
    <body>
      <div className="flex justify-center">
        <div className="w-lvw max-w-[600px] p-4">
          <Link href={"/"}>
            <div className="text-sm font-semibold my-4">🥇 Run Rankings</div>
          </Link>

          <LoadingWrapper>{children}</LoadingWrapper>

          <AboutPageLogger />

          <Analytics />
        </div>
      </div>
    </body>
  </html>
);

export default Layout;
