import { Metadata } from "next";
import Button from "./_components/Button";

export const metadata: Metadata = {
  title: "Run Rankings",
};

const HomePage = async () => {
  return (
    <div>
      <main>
        <Button text={"👫 Friends"} url={"/friends"} />

        <Button text={"👠 Shoes"} url={"/shoes"} />
      </main>
    </div>
  );
};

export default HomePage;

// newest: Friend Name
// friends refetch cron job go to 12 spaced every 2 hours?
// make map of value variable name to db column name
// display key name
// also show absorption for trail?
// add classnames library
// show weight? sub bar? or energy bar, weight bar, overall bar?
// how long are db fetches cached?
// kudos page
