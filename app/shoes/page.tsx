import { createClient } from "@/utils/supabase/client";
import { isDev } from "@/utils/isDev";
import Refetch from "../_components/Refetch";
import Link from "next/link";
import { Metadata } from "next";

type Shoe = { name: string; url: string } & { [key: string]: number };

type ValueColors = [number, number[]][];

export const metadata: Metadata = {
  title: "Run Rankings - 👠 Shoes",
};

const ShoesPage = async () => {
  const supabase = createClient();
  const response = await supabase.from("shoes").select("*");
  const { data, error } = response as { data: Shoe[]; error: null };
  if (error) {
    console.log(error);
  }

  const sortKey = "cold_energy_returned_fore";

  const values = data?.map((shoe) => shoe[sortKey]);
  const maximumValue = Math.max(...values);
  const minimumValue = Math.min(...values);

  const minimumWidth = 5;

  const dataByType = data
    ?.sort(
      (a, b) =>
        (b[sortKey] || 0) - (a[sortKey] || 0) || a.name.localeCompare(b.name),
    )
    .reduce(
      (accumulator, shoe) => {
        accumulator[shoe.type] = [...(accumulator[shoe.type] || []), shoe];

        return accumulator;
      },
      {} as { [key: string]: Shoe[] },
    );

  const valueColors: ValueColors = [
    [50, [239, 130, 119]], // red
    [75, [249, 215, 73]], // yellow
    [100, [73, 159, 248]], // blue
  ];

  const getValueRgb = (value: number, valueColors: ValueColors) => {
    const firstCriteria = valueColors[0];
    if (value <= firstCriteria[0]) {
      return firstCriteria[1];
    }

    const lastCriteria = valueColors[valueColors.length - 1];
    if (value >= lastCriteria[0]) {
      return lastCriteria[1];
    }

    const higherIndex = valueColors.findIndex(
      (criteria) => value <= criteria[0],
    );
    const higherCriteria = valueColors[higherIndex];
    const lowerCriteria = valueColors[higherIndex - 1];
    const split =
      (value - lowerCriteria[0]) / (higherCriteria[0] - lowerCriteria[0]);

    return lowerCriteria[1].map(
      (lowerColor, index) =>
        lowerColor + (higherCriteria[1][index] - lowerColor) * split,
    );
  };

  const showRefetch = false;

  return (
    <div>
      <main>
        {isDev && showRefetch && <Refetch />}

        <Link href={"https://runrepeat.com"}>
          <div className="my-8 text-sm font-semibold">
            Test data from RunRepeat
          </div>
        </Link>

        {Object.entries(dataByType).map(([type, shoes]) => (
          <div key={type}>
            <div className="my-8 text-sm font-semibold">
              {type
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </div>

            {shoes.map((shoe) => {
              const value = shoe[sortKey];
              const width = value
                ? (100 * (value - minimumValue + minimumWidth)) /
                  (maximumValue - minimumValue + minimumWidth)
                : minimumWidth;

              const backgroundColor = getValueRgb(value, valueColors);

              return (
                <div key={shoe.name} className="my-4">
                  <Link target="_blank" href={shoe.url}>
                    <div className="text-sm font-semibold">{shoe.name}</div>

                    <div
                      className={`border border-[rgb(42,43,44)] rounded-md p-1 text-right text-xs font-semibold text-[rgb(18,19,20)]`}
                      style={{
                        width: `${width}%`,
                        backgroundColor: `rgb(${backgroundColor.join(",")})`,
                      }}
                    >
                      {Math.round(shoe[sortKey]) || "-"}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ))}
      </main>
    </div>
  );
};

export default ShoesPage;
