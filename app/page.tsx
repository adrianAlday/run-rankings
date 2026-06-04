import { Metadata } from "next";
import SectionButton from "./_components/SectionButton";

export const metadata: Metadata = {
  title: "Run Rankings",
};

const HomePage = () => (
  <main>
    <SectionButton text={"👫 Friends"} url={"/friends"} />

    <SectionButton text={"👠 Shoes"} url={"/shoes"} />
  </main>
);

export default HomePage;

// friends refetch cron job go to 12 spaced every 2 hours?
// make map of value variable name to db column name
// display key name
// also show absorption for trail?
// add classnames library
// show weight? sub bar? or energy bar, weight bar, overall bar?
// how long are db fetches cached?
// kudos page
