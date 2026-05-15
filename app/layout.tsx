import type { Metadata } from "next";
import "./globals.css";

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
          <div className="w-80">{children}</div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
