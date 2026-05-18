import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Run Rankings",
};
const HomePage = async () => {
  return (
    <div>
      <main>
        <Link href={"/shoes"}>
          <div className="text-sm font-semibold my-4">👠 Shoes</div>
        </Link>
      </main>
    </div>
  );
};

export default HomePage;

// make map of value variable name to db column name
// display key name
// explain math
// fade out shsoes that are beaten on bounce price and weight
// also show absorption for trail?
