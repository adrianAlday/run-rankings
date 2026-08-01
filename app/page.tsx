import { Metadata } from "next";
import SectionButton from "./_components/SectionButton";

export const metadata: Metadata = {
  title: "Run Rankings",
};

const HomePage = () => (
  <main>
    <SectionButton text={"👫 Friends"} url={"/friends"} />

    <SectionButton text={"👠 Shoes"} url={"/shoes"} />

    <SectionButton text={"💅 Rotation"} url={"/rotation"} />
  </main>
);

export default HomePage;

// to do:
// make map of value variable name to db column name
// also show absorption for trail?
// add classnames library
// kudos page
// search icon in find bar
// fetching activites but not groups?
// add gear table to db
// do rotation of last 90 days?
