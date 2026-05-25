import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roster - About ",
};

const AboutPage = () => {
  return (
    <div className="text-xs">
      <div>- PostgreSQL</div>
      <div>- Next.js</div>
    </div>
  );
};

export default AboutPage;
