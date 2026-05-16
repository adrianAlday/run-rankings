import Link from "next/link";

const HomePage = async () => {
  return (
    <div>
      <main>
        <Link href={"/shoes"}>
          <div className="text-sm font-semibold my-4">Shoes</div>
        </Link>
      </main>
    </div>
  );
};

export default HomePage;

// favicon
// page titles
// emojis in homepage link
// make map of value variable name to db column name
// display key name
// explain math
// bar color changes with value, apply by building rgb and passing to style
// use vscode colors?
// red yellow green blue purple
// use comment color for lighter gray
// fade out shsoes that are beaten on bounce price and weight
// also show absorption for trail?
