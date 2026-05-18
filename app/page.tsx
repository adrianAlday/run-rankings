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
          <div
            className={
              "my-8 border border-[rgb(42,43,44)] rounded-md bg-[rgb(65,121,157)] py-1 flex items-center justify-center text-xs text-[rgb(253,254,255)] font-medium"
            }
          >
            <div>👠 Shoes</div>
          </div>
        </Link>
      </main>
    </div>
  );
};

export default HomePage;

// rename column to cold_hardness_increase
// make map of value variable name to db column name
// display key name
// also show absorption for trail?
// add classnames library
