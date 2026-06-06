import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About - Run Rankings",
};

const AboutPage = () => {
  return (
    <div className="my-8 flex flex-col gap-4 text-xs">
      <div>PostgreSQL with Supabase</div>

      <div>Next.js with Vercel</div>

      <div>Strava and RunRepeat APIs</div>

      <Link
        target="_blank"
        href={"https://github.com/adrianAlday/run-rankings"}
      >
        <div className="underline">Repo</div>
      </Link>
    </div>
  );
};

export default AboutPage;
