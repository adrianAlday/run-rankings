import { createClient } from "@/utils/supabase/client";
import { isDev } from "@/utils/isDev";
import Refetch from "../_components/Refetch";
import Link from "next/link";

const ShoesPage = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("shoes").select("*");
  if (error) {
    console.log(error);
  }

  const chunkedData: { [key: string]: { [key: string]: string | number }[] } =
    {};

  const sortKey = "cold_energy_returned_fore";

  data
    ?.sort(
      (a, b) =>
        ((b[sortKey] as number) || 0) - ((a[sortKey] as number) || 0) ||
        (a.name as string).localeCompare(b.name as string),
    )
    .forEach((shoe) => {
      if (!chunkedData[shoe.type]) {
        chunkedData[shoe.type] = [];
      }
      chunkedData[shoe.type] = [...chunkedData[shoe.type], shoe];
    });

  return (
    <div>
      <main>
        {isDev && <Refetch />}

        {Object.entries(chunkedData).map(([type, shoes]) => {
          const maximumValue = Math.max(
            ...shoes.map((shoe) => shoe[sortKey] as number),
          );
          const minimumValue = Math.min(
            ...shoes.map((shoe) => shoe[sortKey] as number),
          );
          console.log("maximumValue", maximumValue);
          console.log("minimumValue", minimumValue);

          const minimumWidth = 5;

          return (
            <div key={type}>
              <div className="my-4 text-[#9198a1]">
                {type
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </div>

              {shoes.map((shoe) => {
                const value = shoe[sortKey];
                const width = value
                  ? (100 * ((value as number) - minimumValue + minimumWidth)) /
                    (maximumValue - minimumValue + minimumWidth)
                  : minimumWidth;

                return (
                  <div key={shoe.name} className="my-4">
                    <Link target="_blank" href={shoe.url as string}>
                      <div className="text-sm font-semibold">{shoe.name}</div>

                      <div
                        className={`mt-2 border border-[#3d444d] rounded-md bg-[#238636] p-1 text-right text-xs font-semibold`}
                        style={{ width: `${width}%` }}
                      >
                        {Math.round(shoe[sortKey] as number) || "-"}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          );
        })}

        <Link href={"https://runrepeat.com"}>
          <div className="my-4">Test data from RunRepeat</div>
        </Link>
      </main>
    </div>
  );
};

export default ShoesPage;
