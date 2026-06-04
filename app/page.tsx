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

// to do:
// make map of value variable name to db column name
// also show absorption for trail?
// add classnames library
// kudos page
